const xlsx = require('xlsx');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const fileSep = path.sep;// returns '\\' on windows, '/' on *nix

module.exports = {
  /**
     * Read needed sheet from xlsx file as json.
     *
     * @param filePath
     * @param sheet
     * @param replaceUndefinedWithEmptyString if set true all undefined cells will be replaced by ''
     * @returns {promise.Promise<any>}
     */
  readFileContent: function (filePath, sheet, replaceUndefinedWithEmptyString = false) {
    const timeout = browser.params.fileDownloadGlobalWait || 120000;
    return browser.wait(function () {
      // Wait until the file has been downloaded.
      // We need to wait thus as otherwise protractor has a nasty habit of
      // trying to do any following tests while the file is still being
      // downloaded and hasn't been moved to its final location.
      return fs.existsSync(filePath);
    }, timeout, filePath + ' is not found after ' + timeout + ' ms.').then(function () {
      // Do whatever checks you need here.  This is a simple comparison;
      // for a larger file you might want to do calculate the file's MD5
      // hash and see if it matches what you expect.
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[sheet];
      const sheetToRead = workbook.Sheets[sheetName];
      if (replaceUndefinedWithEmptyString) {
        return xlsx.utils.sheet_to_json(sheetToRead, {header: 1, defval: ''});
      }
      return xlsx.utils.sheet_to_json(sheetToRead, {header: 1});
    });
  },
  /**
     * Read needed sheet from xlsx file as json. Getting file by part name.
     @param dirPath. Path of xlsx directory location.
     @param fileName. Unique part of the mname of xlsx file.
     @param sheet. Number of sheet in xlsx file (int)
     @param replaceUndefinedWithEmptyString If TRUE, all "undefined" = ' '
     @returns {promise.Promise<any>}
     **/
  readContentOfFileWithPartName: function (dirPath, fileName, sheet, replaceUndefinedWithEmptyString = false) {
    let expectedFile = 'File Not Found';
    const timeout = browser.params.fileDownloadGlobalWait || 120000;
    return browser.wait(function () {
      return fs.existsSync(dirPath);
    }, timeout, dirPath + ' is not found after ' + timeout + ' ms.').then(function () {
      return browser.wait(function () {
        fs.readdirSync(dirPath).forEach((curFileName) => {
          if (curFileName.indexOf(fileName) >= 0) {
            expectedFile = curFileName.replace('.crdownload', '');
          }
        });
        return fs.existsSync(dirPath + fileSep + expectedFile);
      }, timeout, 'File with name that contains ' + fileName + ' is not downloaded').then(function () {
        const workbook = xlsx.readFile(dirPath + fileSep + expectedFile);
        const sheetName = workbook.SheetNames[sheet];
        const sheetToRead = workbook.Sheets[sheetName];
        if (replaceUndefinedWithEmptyString) {
          return xlsx.utils.sheet_to_json(sheetToRead, {header: 1, defval: ''});
        }
        return xlsx.utils.sheet_to_json(sheetToRead, {header: 1});
      });
    });
  },

  /**
     * Read name of needed sheet from xlsx file as string.
     *
     * @param filePath
     * @param sheet
     * @returns {promise.Promise<any>}
     */
  readFileSheetName: function (filePath, sheet) {
    const timeout = browser.params.fileDownloadGlobalWait || 120000;
    return browser.wait(function () {
      // Wait until the file has been downloaded.
      // We need to wait thus as otherwise protractor has a nasty habit of
      // trying to do any following tests while the file is still being
      // downloaded and hasn't been moved to its final location.
      return fs.existsSync(filePath);
    }, timeout, filePath + ' is not found after ' + timeout + ' ms.').then(function () {
      // Do whatever checks you need here.  This is a simple comparison;
      // for a larger file you might want to do calculate the file's MD5
      // hash and see if it matches what you expect.
      const workbook = xlsx.readFile(filePath);
      return workbook.SheetNames[sheet];
    });
  },

  /**
     * Checks if BaseDir/test directory exists and deletes it.
     *
     * @param directoryPath
     * @returns {promise.Promise<any>}
     */
  removeDirectory: function (directoryPath) {
    return browser.wait(function () {
      return fs.existsSync(directoryPath)
    }, 1000, 'Wait for \'' + directoryPath + '\' appears').then(function () {
      deleteFolderRecursive(directoryPath);
    }, function (error) {
      // console.log("The directory '" + directoryPath+ "' is not found");
    })
  },

  /**
     * Verify if file with appropriate name is exist in BaseDir/test directory.
     *
     * @param directoryPath
     * @return {Promise<boolean>}
     */
  isFileExist: function (directoryPath) {
    return browser.wait(function () {
      return fs.existsSync(directoryPath);
    }, 1000, 'Wait for \'' + directoryPath + '\' appears').then(() => true, () => false);
  },


  /** Wait 120 seconds file to exist and resolves file hash according to hash type provided.
     * Method resolves file hash according to hash type provided.
     * @param filePath - absolute path
     * @param hashType default value is 'sha1'.
     * @returns {Promise<any>} hash value
     */
  getFileHash: function (filePath, hashType = 'sha1') {
    const timeout = browser.params.fileDownloadGlobalWait || 120000;
    return browser.wait(function () {
      return fs.existsSync(filePath);
    }, timeout, filePath + ' is not found after ' + timeout + ' ms.').then(function () {
      let readStream = fs.createReadStream(filePath);
      let hash = crypto.createHash(hashType);
      return new Promise((resolve, reject) => {
        readStream
          .on('data', function (chunk) {
            hash.update(chunk);
          })
          .on('end', function () {
            resolve(hash.digest('hex'));
          })
          .on('error', function (error) {
            reject(error);
          })
      });
    });
  },

};

/**
 * Checks if BaseDir/test directory contains files and deletes them.
 *
 * @param path
 */
function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      let curPath = path + '/' + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}