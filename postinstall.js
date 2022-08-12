const fs = require('fs')

const function_file_path = "./node_modules/bulma/sass/utilities";
const function_file_name = `${function_file_path}/functions.sass`;
const backup_function_file_name = `${function_file_path}/functions-backup.sass`;

try {
  if (fs.existsSync(function_file_name) && !fs.existsSync(backup_function_file_name)) {
    fs.copyFile(function_file_name, backup_function_file_name, (e) => {
      if (e) {
        console.log("Error Found:", e);
      } else {
        fs.copyFile('./functions.sass', function_file_name, (e) => {
          if (e) {
            console.log("Error Found:", e);
          }
        });
      }
    });
  }
} catch (e) {
  console.error(e)
}