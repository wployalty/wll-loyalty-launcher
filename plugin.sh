#!/bin/bash
echo "Email Customizer Advanced"
current_dir="$PWD"
react_folder_path=$current_dir"/launcher-admin-ui"
react_js_dist_path=$current_dir"/assets/admin/js/dist"
react_node_module_path=$current_dir"/launcher-admin-ui/node_modules"

react_site_folder_path=$current_dir"/launcher-site-ui"
react_site_js_dist_path=$current_dir"/assets/site/js/dist"
react_site_node_module_path=$current_dir"/launcher-site-ui/node_modules"

composer_lock_pack=$current_dir"/composer.lock"

pro_plugin_name="wll-loyalty-launcher"
pack_pro_folder=$current_dir"/../compressed_pack"
plugin_pro_compress_folder=$pack_pro_folder"/"$pro_plugin_name

composer_run() {
  # shellcheck disable=SC2164
  cd "$current_dir"
  rm "$composer_lock_pack"
  composer install --no-dev
  composer update --no-dev
  cd ..
  echo "Compress Done"
  echo "Launcher Admin NPM"
  rm -r "$react_node_module_path"
  rm -r "$react_js_dist_path"
  # shellcheck disable=SC2164
  cd "$react_folder_path"
  source ~/.nvm/nvm.sh
  nvm use 20
  npm i -q
  npm run build -q
  echo "Launcher Admin NPM Done"
  # shellcheck disable=SC2164
  cd "$current_dir"
  echo "Launcher Site NPM"
  rm -r "$react_site_node_module_path"
  rm -r "$react_site_js_dist_path"
  # shellcheck disable=SC2164
  cd "$react_site_folder_path"
  source ~/.nvm/nvm.sh
  nvm use 20
  npm i -q
  npm run build -q
  echo "Launcher Site NPM Done"
  # shellcheck disable=SC2164
  cd "$current_dir"
}
update_ini_file() {
  cd $current_dir
  wp i18n make-pot . "i18n/languages/$pro_plugin_name.pot" --slug="$pro_plugin_name" --domain="$pro_plugin_name" --include=$pro_plugin_name".php",/App/ --headers='{"Last-Translator":"Wployalty <support@wployalty.net>","Language-Team":"Wployalty <support@wployalty.net>"}' --allow-root
  cd $current_dir
  echo "Update ini done"
}
copy_pro_folder() {
  if [ -d "$pack_pro_folder" ]; then
    rm -r "$pack_pro_folder"
  fi
  mkdir "$pack_pro_folder"
  mkdir "$plugin_pro_compress_folder"
  move_dir=("App" "assets" "i18n" "vendor" "composer.json" "readme.txt" $pro_plugin_name".php")
  # shellcheck disable=SC2068
  for dir in ${move_dir[@]}; do
    cp -r "$current_dir/$dir" "$plugin_pro_compress_folder/$dir"
  done
}

remove_pro_folder() {
  # vendor unwanted file
  remove_pro_path=$plugin_pro_compress_folder"/assets/site/css"
  remove_dir=("launcher-ui.scss" "launcher-ui.css.map")
  for dir in ${remove_dir[@]}; do
    rm -r $remove_pro_path"/"$dir
  done
}
zip_pro_folder() {
  cd "$pack_pro_folder"
  rm "$pro_plugin_name".zip
  zip -r "$pro_plugin_name".zip $pro_plugin_name -q
  zip -d "$pro_plugin_name".zip __MACOSX/\*
  zip -d "$pro_plugin_name".zip \*/.DS_Store
}

echo "Composer Run:"
composer_run
echo "Update ini"
update_ini_file
echo "Copy Folder:"
copy_pro_folder
echo "Remove unwanted folder"
remove_pro_folder
echo "Zip Folder:"
zip_pro_folder
echo "End"