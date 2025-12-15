"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

require('dotenv').config({
  path: __dirname + '/../.env'
});

var _require = require('child_process'),
    exec = _require.exec;

var fs = require('fs');

var path = require('path');

var DatabaseBackup =
/*#__PURE__*/
function () {
  function DatabaseBackup() {
    _classCallCheck(this, DatabaseBackup);

    this.backupDir = path.join(__dirname, '../backups');
    this.ensureBackupDir();
  }

  _createClass(DatabaseBackup, [{
    key: "ensureBackupDir",
    value: function ensureBackupDir() {
      if (!fs.existsSync(this.backupDir)) {
        fs.mkdirSync(this.backupDir, {
          recursive: true
        });
      }
    }
  }, {
    key: "createBackup",
    value: function createBackup() {
      var timestamp, backupFile, databaseUrl, url, host, port, database, username, password, mysqldumpCommand;
      return regeneratorRuntime.async(function createBackup$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              timestamp = new Date().toISOString().replace(/[:.]/g, '-');
              backupFile = path.join(this.backupDir, "full-backup-".concat(timestamp, ".sql")); // Parse DATABASE_URL

              databaseUrl = process.env.DATABASE_URL;

              if (databaseUrl) {
                _context.next = 5;
                break;
              }

              throw new Error('DATABASE_URL environment variable is required');

            case 5:
              url = new URL(databaseUrl);
              host = url.hostname;
              port = url.port || '3306';
              database = url.pathname.substring(1);
              username = url.username;
              password = url.password;
              mysqldumpCommand = "mysqldump -h ".concat(host, " -P ").concat(port, " -u ").concat(username, " -p").concat(password, " ").concat(database, " > ").concat(backupFile);
              return _context.abrupt("return", new Promise(function (resolve, reject) {
                exec(mysqldumpCommand, function (error, stdout, stderr) {
                  if (error) {
                    console.error('❌ Backup failed:', error);
                    reject(error);
                  } else {
                    console.log("\u2705 Full database backup created: ".concat(backupFile));
                    resolve(backupFile);
                  }
                });
              }));

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }]);

  return DatabaseBackup;
}();

if (require.main === module) {
  var backup = new DatabaseBackup();
  backup.createBackup().then(function () {
    return console.log('Backup completed successfully');
  })["catch"](console.error);
}

module.exports = DatabaseBackup;