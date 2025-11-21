#!/usr/bin/env node
/**
 * Markdown Documentation Quality Validator
 * 
 * This script validates Markdown files against ng-alain-gighub documentation standards.
 * Based on: .github/agents/markdown-documentation-standards.md
 * 
 * Usage:
 *   node scripts/validate-docs.js [file-pattern]
 *   node scripts/validate-docs.js "docs/**\/*.md"
 *   node scripts/validate-docs.js --all
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class DocValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.fileCount = 0;
    
    // Special files that are allowed to use different naming
    this.specialFiles = new Set([
      'README.md', 'CONTRIBUTING.md', 'CHANGELOG.md', 'LICENSE.md',
      'AGENTS.md', 'CLAUDE.md', 'GEMINI.md', 'README-zh_CN.md',
      'DOCUMENTATION.md', 'QUICK-START.md', 'PULL_REQUEST_TEMPLATE.md', 
      'MEMORY_SUMMARY.md', 'AUTO-LOAD-IMPLEMENTATION.md', 'USAGE-GUIDE.md', 
      'QUICK_START.md', 'FINAL-SUMMARY.md', 'MCP-Server-Verification-Report.md', 
      'MERGE_PLAN.md'
    ]);
  }

  /**
   * Check if filename follows kebab-case convention
   */
  validateNaming(filepath) {
    const filename = path.basename(filepath);
    
    if (this.specialFiles.has(filename)) {
      return true;
    }
    
    // Check for uppercase, underscores, or Chinese characters
    const basename = filename.replace('.md', '');
    if (/[A-Z_\u4e00-\u9fff]/.test(basename)) {
      this.errors.push({
        file: filepath,
        type: 'naming',
        message: `File name should use kebab-case (lowercase with hyphens): ${filename}`
      });
      return false;
    }
    
    return true;
  }

  /**
   * Check heading hierarchy (single H1, no level skipping)
   */
  validateHeadings(filepath, content) {
    const lines = content.split('\n');
    const headings = [];
    let inCodeBlock = false;
    
    for (let i = 0; i < lines.length; i++) {
      // Track code block state
      if (lines[i].trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        continue;
      }
      
      // Skip headings inside code blocks
      if (inCodeBlock) {
        continue;
      }
      
      const match = lines[i].match(/^(#{1,6})\s+(.+)/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        headings.push({ level, text, line: i + 1 });
      }
    }
    
    if (headings.length === 0) {
      return true; // No headings, skip validation
    }
    
    // Check for single H1
    const h1Count = headings.filter(h => h.level === 1).length;
    if (h1Count === 0) {
      this.warnings.push({
        file: filepath,
        type: 'heading',
        message: 'No H1 heading found. Every document should have exactly one H1.'
      });
    } else if (h1Count > 1) {
      this.errors.push({
        file: filepath,
        type: 'heading',
        message: `Multiple H1 headings found (${h1Count}). Only one H1 is allowed.`
      });
    }
    
    // Check hierarchy (no level skipping)
    let prevLevel = 0;
    for (const heading of headings) {
      if (prevLevel > 0 && heading.level > prevLevel + 1) {
        this.errors.push({
          file: filepath,
          type: 'heading',
          line: heading.line,
          message: `Heading level skip from H${prevLevel} to H${heading.level}. Use sequential levels.`
        });
      }
      prevLevel = heading.level;
    }
    
    return this.errors.length === 0;
  }

  /**
   * Check for required sections (Purpose, Audience)
   */
  validateRequiredSections(filepath, content) {
    // Only check for guides, specs, and reference docs
    const shouldCheck = /\/(guides|specs|reference)\//.test(filepath);
    if (!shouldCheck) {
      return true;
    }
    
    const lines = content.split('\n');
    // Accept both heading format (## 目的) and blockquote format (> **目的**:)
    const hasPurpose = lines.some(line => 
      /^#{2,3}\s+(目的|Purpose)/.test(line) || 
      /^>\s+\*\*目的\*\*/.test(line) ||
      /^>\s+\*\*Purpose\*\*/.test(line)
    );
    const hasAudience = lines.some(line => /^#{2,3}\s+(目標讀者|Audience)/.test(line));
    
    if (!hasPurpose) {
      this.warnings.push({
        file: filepath,
        type: 'required-section',
        message: 'Missing "目的 (Purpose)" section. Add purpose to explain document intent.'
      });
    }
    
    if (!hasAudience) {
      this.warnings.push({
        file: filepath,
        type: 'required-section',
        message: 'Missing "目標讀者 (Audience)" section. Add audience to clarify target readers.'
      });
    }
    
    return hasPurpose && hasAudience;
  }

  /**
   * Check code block language tags
   */
  validateCodeBlocks(filepath, content) {
    const codeBlockPattern = /```(\w*)\n/g;
    let match;
    let hasIssues = false;
    
    while ((match = codeBlockPattern.exec(content)) !== null) {
      if (!match[1]) {
        const lineNum = content.substring(0, match.index).split('\n').length;
        this.warnings.push({
          file: filepath,
          type: 'code-block',
          line: lineNum,
          message: 'Code block missing language tag. Add language for syntax highlighting.'
        });
        hasIssues = true;
      }
    }
    
    return !hasIssues;
  }

  /**
   * Validate a single file
   */
  validateFile(filepath) {
    this.fileCount++;
    
    if (!fs.existsSync(filepath)) {
      this.errors.push({
        file: filepath,
        type: 'file',
        message: 'File does not exist'
      });
      return false;
    }
    
    const content = fs.readFileSync(filepath, 'utf8');
    
    // Run validations
    this.validateNaming(filepath);
    this.validateHeadings(filepath, content);
    this.validateRequiredSections(filepath, content);
    this.validateCodeBlocks(filepath, content);
    
    return true;
  }

  /**
   * Validate all files matching pattern
   */
  validateAll(pattern = '**/*.md') {
    const files = glob.sync(pattern, {
      ignore: ['node_modules/**', '.git/**', '.yarn/**']
    });
    
    console.log(`\n🔍 Validating ${files.length} Markdown files...\n`);
    
    files.forEach(file => this.validateFile(file));
    
    this.printResults();
  }

  /**
   * Print validation results
   */
  printResults() {
    console.log(`\n${'='.repeat(80)}`);
    console.log('📊 Validation Results');
    console.log('='.repeat(80));
    console.log(`Files checked: ${this.fileCount}`);
    console.log(`Errors: ${this.errors.length}`);
    console.log(`Warnings: ${this.warnings.length}`);
    console.log('='.repeat(80));
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors:\n');
      this.errors.forEach(err => {
        const location = err.line ? ` (line ${err.line})` : '';
        console.log(`  ${err.file}${location}`);
        console.log(`    ↳ ${err.message}\n`);
      });
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️  Warnings:\n');
      this.warnings.slice(0, 20).forEach(warn => {
        const location = warn.line ? ` (line ${warn.line})` : '';
        console.log(`  ${warn.file}${location}`);
        console.log(`    ↳ ${warn.message}\n`);
      });
      
      if (this.warnings.length > 20) {
        console.log(`  ... and ${this.warnings.length - 20} more warnings\n`);
      }
    }
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('\n✅ All checks passed! Documentation quality is good.\n');
    }
    
    console.log('='.repeat(80));
    console.log('\n📚 Documentation Standards: .github/agents/markdown-documentation-standards.md');
    console.log('📋 Quality Report: docs/markdown-documentation-quality-analysis-report.md\n');
    
    // Exit with error code if there are errors
    if (this.errors.length > 0) {
      process.exit(1);
    }
  }
}

// Main execution
if (require.main === module) {
  const validator = new DocValidator();
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--all') {
    validator.validateAll();
  } else {
    validator.validateAll(args[0]);
  }
}

module.exports = DocValidator;
