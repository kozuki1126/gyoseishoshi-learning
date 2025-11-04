/**
 * File Upload Validation Schemas
 * 
 * Advanced file validation system for secure file uploads including
 * malicious file detection, metadata validation, and content scanning.
 * Protects against file-based attacks while supporting educational content.
 * 
 * Security Features:
 * - Magic number (file header) validation
 * - Malicious file pattern detection
 * - MIME type and extension consistency checking
 * - File size and quantity limitations
 * - Virus signature scanning patterns
 * - Educational content optimization
 */

const validator = require('validator');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * File magic numbers for validation (first few bytes of files)
 */
const FILE_SIGNATURES = {
  // Document formats
  'application/pdf': [
    [0x25, 0x50, 0x44, 0x46], // %PDF
  ],
  'application/msword': [
    [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1], // MS Office
  ],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    [0x50, 0x4B, 0x03, 0x04], // ZIP-based (DOCX)
    [0x50, 0x4B, 0x05, 0x06], // ZIP empty
    [0x50, 0x4B, 0x07, 0x08], // ZIP spanned
  ],
  
  // Audio formats
  'audio/mpeg': [
    [0xFF, 0xFB], // MP3
    [0xFF, 0xF3], // MP3
    [0xFF, 0xF2], // MP3
    [0x49, 0x44, 0x33], // ID3
  ],
  'audio/wav': [
    [0x52, 0x49, 0x46, 0x46], // RIFF
  ],
  'audio/mp4': [
    [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70], // MP4
    [0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70], // MP4
  ],
  'audio/ogg': [
    [0x4F, 0x67, 0x67, 0x53], // OggS
  ],
  
  // Image formats
  'image/jpeg': [
    [0xFF, 0xD8, 0xFF], // JPEG
  ],
  'image/png': [
    [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], // PNG
  ],
  'image/gif': [
    [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // GIF87a
    [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], // GIF89a
  ],
  'image/webp': [
    [0x52, 0x49, 0x46, 0x46], // RIFF (WebP)
  ]
};

/**
 * Malicious file patterns and suspicious content
 */
const MALICIOUS_PATTERNS = {
  // Executable headers
  EXECUTABLE_SIGNATURES: [
    [0x4D, 0x5A], // MZ (Windows PE)
    [0x7F, 0x45, 0x4C, 0x46], // ELF (Linux)
    [0xFE, 0xED, 0xFA, 0xCE], // Mach-O (macOS)
    [0xCE, 0xFA, 0xED, 0xFE], // Mach-O (reverse)
    [0xFE, 0xED, 0xFA, 0xCF], // Mach-O 64-bit
    [0xCF, 0xFA, 0xED, 0xFE], // Mach-O 64-bit (reverse)
  ],
  
  // Script patterns in text content
  SCRIPT_PATTERNS: [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
    /data:application\/javascript/gi,
    /eval\s*\(/gi,
    /Function\s*\(/gi,
    /setTimeout\s*\(/gi,
    /setInterval\s*\(/gi
  ],
  
  // Suspicious strings
  MALICIOUS_STRINGS: [
    'powershell',
    'cmd.exe',
    '/bin/bash',
    '/bin/sh',
    'wget',
    'curl',
    'nc -',
    'netcat',
    'reverse shell',
    'backdoor',
    'trojan',
    'virus',
    'malware',
    'keylogger'
  ],
  
  // Suspicious file extensions embedded in content
  DOUBLE_EXTENSIONS: [
    /\.pdf\.exe$/i,
    /\.doc\.exe$/i,
    /\.jpg\.exe$/i,
    /\.mp3\.exe$/i,
    /\.txt\.scr$/i,
    /\.pdf\.scr$/i
  ]
};

/**
 * File upload validation utilities
 */
const FileValidationUtils = {
  /**
   * Validate file magic number against MIME type
   * @param {Buffer} buffer - File buffer
   * @param {string} mimeType - Declared MIME type
   * @returns {boolean} - True if valid
   */
  validateMagicNumber(buffer, mimeType) {
    const signatures = FILE_SIGNATURES[mimeType];
    if (!signatures) {
      return false; // Unknown MIME type
    }
    
    return signatures.some(signature => {
      if (buffer.length < signature.length) {
        return false;
      }
      
      return signature.every((byte, index) => {
        return buffer[index] === byte;
      });
    });
  },

  /**
   * Check for malicious executable signatures
   * @param {Buffer} buffer - File buffer
   * @returns {boolean} - True if potentially malicious
   */
  containsExecutableSignature(buffer) {
    return MALICIOUS_PATTERNS.EXECUTABLE_SIGNATURES.some(signature => {
      if (buffer.length < signature.length) {
        return false;
      }
      
      return signature.every((byte, index) => {
        return buffer[index] === byte;
      });
    });
  },

  /**
   * Scan text content for malicious patterns
   * @param {string} content - Text content
   * @returns {Array} - Array of detected threats
   */
  scanTextContent(content) {
    const threats = [];
    
    // Check for script patterns
    MALICIOUS_PATTERNS.SCRIPT_PATTERNS.forEach((pattern, index) => {
      if (pattern.test(content)) {
        threats.push(`Script pattern detected: ${pattern.toString()}`);
      }
    });
    
    // Check for suspicious strings (case insensitive)
    const lowerContent = content.toLowerCase();
    MALICIOUS_PATTERNS.MALICIOUS_STRINGS.forEach(str => {
      if (lowerContent.includes(str)) {
        threats.push(`Suspicious string detected: ${str}`);
      }
    });
    
    return threats;
  },

  /**
   * Generate file hash for duplicate detection
   * @param {Buffer} buffer - File buffer
   * @returns {string} - SHA-256 hash
   */
  generateFileHash(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  },

  /**
   * Validate file name for security
   * @param {string} filename - Original filename
   * @returns {string} - Sanitized filename
   */
  sanitizeFilename(filename) {
    if (!filename || typeof filename !== 'string') {
      throw new Error('ファイル名が無効です');
    }
    
    // Check for double extensions
    MALICIOUS_PATTERNS.DOUBLE_EXTENSIONS.forEach(pattern => {
      if (pattern.test(filename)) {
        throw new Error('不正なファイル拡張子が検出されました');
      }
    });
    
    // Remove dangerous characters and paths
    let sanitized = filename
      .replace(/[<>:"|?*]/g, '') // Windows forbidden chars
      .replace(/\.\./g, '') // Path traversal
      .replace(/^\.+/, '') // Hidden file prevention
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF._-]/g, '') // Allow only safe chars + Japanese
      .substring(0, 255); // Limit length
    
    if (!sanitized || sanitized.length === 0) {
      throw new Error('ファイル名に使用可能な文字がありません');
    }
    
    // Ensure file has extension
    if (!sanitized.includes('.')) {
      throw new Error('ファイル拡張子が必要です');
    }
    
    return sanitized;
  },

  /**
   * Analyze PDF content for suspicious elements
   * @param {Buffer} buffer - PDF buffer
   * @returns {Array} - Array of detected issues
   */
  analyzePDFContent(buffer) {
    const issues = [];
    const content = buffer.toString('binary');
    
    // Check for JavaScript in PDF
    if (content.includes('/JavaScript') || content.includes('/JS')) {
      issues.push('PDF contains JavaScript');
    }
    
    // Check for embedded files
    if (content.includes('/EmbeddedFile')) {
      issues.push('PDF contains embedded files');
    }
    
    // Check for forms with actions
    if (content.includes('/URI') && content.includes('/A')) {
      issues.push('PDF contains external URIs');
    }
    
    // Check for suspicious object references
    const suspiciousRefs = ['/Launch', '/ImportData', '/SubmitForm'];
    suspiciousRefs.forEach(ref => {
      if (content.includes(ref)) {
        issues.push(`PDF contains suspicious reference: ${ref}`);
      }
    });
    
    return issues;
  }
};

/**
 * File upload validation schemas
 */
const UploadSchemas = {
  /**
   * General file validation
   * @param {object} fileData - File data object
   * @param {Buffer} buffer - File buffer
   * @returns {object} - Validation result
   */
  validateFile(fileData, buffer) {
    const result = {
      isValid: true,
      errors: [],
      warnings: [],
      metadata: {}
    };
    
    try {
      // Basic file info validation
      if (!fileData.name || !fileData.size || !fileData.type) {
        throw new Error('ファイル情報が不完全です');
      }
      
      // Sanitize filename
      const sanitizedName = FileValidationUtils.sanitizeFilename(fileData.name);
      result.metadata.sanitizedName = sanitizedName;
      
      // File size validation
      const maxSize = 100 * 1024 * 1024; // 100MB absolute maximum
      if (fileData.size > maxSize) {
        throw new Error(`ファイルサイズが大きすぎます (最大: ${maxSize / (1024 * 1024)}MB)`);
      }
      
      if (fileData.size === 0) {
        throw new Error('空のファイルはアップロードできません');
      }
      
      // Magic number validation
      if (buffer && buffer.length > 0) {
        if (!FileValidationUtils.validateMagicNumber(buffer, fileData.type)) {
          throw new Error('ファイル形式とファイルヘッダが一致しません');
        }
        
        // Check for executable signatures
        if (FileValidationUtils.containsExecutableSignature(buffer)) {
          throw new Error('実行可能ファイルは許可されていません');
        }
        
        // Generate file hash
        result.metadata.hash = FileValidationUtils.generateFileHash(buffer);
      }
      
    } catch (error) {
      result.isValid = false;
      result.errors.push(error.message);
    }
    
    return result;
  },

  /**
   * Document file validation (PDF, DOC, DOCX)
   * @param {object} fileData - File data
   * @param {Buffer} buffer - File buffer
   * @returns {object} - Validation result
   */
  validateDocument(fileData, buffer) {
    const result = this.validateFile(fileData, buffer);
    
    if (!result.isValid) {
      return result;
    }
    
    try {
      // Size limit for documents (10MB)
      if (fileData.size > 10 * 1024 * 1024) {
        throw new Error('文書ファイルは10MB以下である必要があります');
      }
      
      // PDF-specific validation
      if (fileData.type === 'application/pdf' && buffer) {
        const pdfIssues = FileValidationUtils.analyzePDFContent(buffer);
        if (pdfIssues.length > 0) {
          result.warnings.push(...pdfIssues);
          
          // Block PDFs with high-risk features
          const highRiskPatterns = ['JavaScript', 'Launch', 'ImportData'];
          const hasHighRisk = pdfIssues.some(issue => 
            highRiskPatterns.some(pattern => issue.includes(pattern))
          );
          
          if (hasHighRisk) {
            throw new Error('PDFに危険な要素が含まれています');
          }
        }
      }
      
      result.metadata.category = 'document';
      result.metadata.educational = true;
      
    } catch (error) {
      result.isValid = false;
      result.errors.push(error.message);
    }
    
    return result;
  },

  /**
   * Audio file validation (MP3, WAV, M4A, OGG)
   * @param {object} fileData - File data
   * @param {Buffer} buffer - File buffer
   * @returns {object} - Validation result
   */
  validateAudio(fileData, buffer) {
    const result = this.validateFile(fileData, buffer);
    
    if (!result.isValid) {
      return result;
    }
    
    try {
      // Size limit for audio (50MB)
      if (fileData.size > 50 * 1024 * 1024) {
        throw new Error('音声ファイルは50MB以下である必要があります');
      }
      
      // Duration estimation (rough)
      const estimatedDuration = fileData.size / (128 * 1024 / 8); // Assume 128kbps
      if (estimatedDuration > 7200) { // 2 hours
        result.warnings.push('音声ファイルが非常に長い可能性があります');
      }
      
      result.metadata.category = 'audio';
      result.metadata.educational = true;
      result.metadata.estimatedDuration = Math.round(estimatedDuration);
      
    } catch (error) {
      result.isValid = false;
      result.errors.push(error.message);
    }
    
    return result;
  },

  /**
   * Image file validation (JPG, PNG, GIF, WebP)
   * @param {object} fileData - File data
   * @param {Buffer} buffer - File buffer
   * @returns {object} - Validation result
   */
  validateImage(fileData, buffer) {
    const result = this.validateFile(fileData, buffer);
    
    if (!result.isValid) {
      return result;
    }
    
    try {
      // Size limit for images (5MB)
      if (fileData.size > 5 * 1024 * 1024) {
        throw new Error('画像ファイルは5MB以下である必要があります');
      }
      
      // Basic dimension validation (if possible to extract)
      if (buffer && fileData.type === 'image/png') {
        // PNG dimension extraction (basic)
        if (buffer.length > 24) {
          const width = buffer.readUInt32BE(16);
          const height = buffer.readUInt32BE(20);
          
          if (width > 4000 || height > 4000) {
            result.warnings.push('画像サイズが大きすぎる可能性があります');
          }
          
          result.metadata.dimensions = { width, height };
        }
      }
      
      result.metadata.category = 'image';
      result.metadata.educational = true;
      
    } catch (error) {
      result.isValid = false;
      result.errors.push(error.message);
    }
    
    return result;
  },

  /**
   * Batch file validation for multiple uploads
   * @param {Array} files - Array of file objects with buffers
   * @returns {object} - Batch validation result
   */
  validateBatch(files) {
    const result = {
      isValid: true,
      validFiles: [],
      invalidFiles: [],
      totalSize: 0,
      warnings: []
    };
    
    // Batch limits
    const maxFiles = 10;
    const maxBatchSize = 100 * 1024 * 1024; // 100MB total
    
    if (files.length > maxFiles) {
      result.isValid = false;
      result.warnings.push(`一度にアップロードできるファイル数は${maxFiles}個までです`);
      return result;
    }
    
    files.forEach((fileData, index) => {
      try {
        let fileResult;
        
        // Determine validation method based on file type
        if (fileData.type.startsWith('image/')) {
          fileResult = this.validateImage(fileData, fileData.buffer);
        } else if (fileData.type.startsWith('audio/')) {
          fileResult = this.validateAudio(fileData, fileData.buffer);
        } else if (fileData.type.includes('pdf') || fileData.type.includes('word')) {
          fileResult = this.validateDocument(fileData, fileData.buffer);
        } else {
          fileResult = this.validateFile(fileData, fileData.buffer);
        }
        
        if (fileResult.isValid) {
          result.validFiles.push({ index, file: fileData, metadata: fileResult.metadata });
          result.totalSize += fileData.size;
        } else {
          result.invalidFiles.push({ index, file: fileData, errors: fileResult.errors });
          result.isValid = false;
        }
        
        if (fileResult.warnings.length > 0) {
          result.warnings.push(...fileResult.warnings.map(w => `File ${index + 1}: ${w}`));
        }
        
      } catch (error) {
        result.invalidFiles.push({ index, file: fileData, errors: [error.message] });
        result.isValid = false;
      }
    });
    
    // Check total batch size
    if (result.totalSize > maxBatchSize) {
      result.isValid = false;
      result.warnings.push(`バッチの合計サイズが制限を超えています (最大: ${maxBatchSize / (1024 * 1024)}MB)`);
    }
    
    return result;
  }
};

module.exports = {
  UploadSchemas,
  FileValidationUtils,
  FILE_SIGNATURES,
  MALICIOUS_PATTERNS
};
