import{ configurations, update_cookie_configurations, toogle_option_menu }from"./global.js";
import{ width_columns_default, update_cookie_width_columns }from"./cco-informa-config.js";

window.document.title = "INFORMA"

var _configurations = configurations;

const menu_config = document.getElementById("menu-configurations");
const confirm_button = document.getElementById("confirm-config");
const cancel_button = document.getElementById("cancel-config");
const dark_mode_button = document.getElementById("dark-mode");
const span_dark_mode = document.getElementById("span-dark-mode");
const cursor_button = document.getElementById("cursor");
const span_cursor = document.getElementById("span-cursor");
const open_config = document.getElementById("open-config");
const span_cco_informa = document.getElementById("span-restore-columns-cco-informa");
const button_cco_informa = document.getElementById("restore-cco-informa");

var reset_width = false;

const update_color_spans = ()=>{
    console.log(configurations)
    span_cco_informa.classList = reset_width?["color-green"]:["color-red"]
    span_dark_mode.classList = _configurations.dark_mode?["color-green"]:["color-red"];
    span_cursor.classList = _configurations.cursor_personalizado?["color-green"]:["color-red"];
}
const toogle_dark_mode = ()=>{
    _configurations = toogle_option_menu(_configurations, "dark_mode");
    update_color_spans();
}
const toogle_cursor = ()=>{
    _configurations = toogle_option_menu(_configurations, "cursor_personalizado");
    update_color_spans();
}
const confirm_alterations = ()=>{
    update_cookie_configurations(_configurations);if(reset_width)update_cookie_width_columns(width_columns_default);
}
const cancel_alterations = ()=>{
    menu_config.classList.remove("revel");
    dark_mode_button.removeEventListener("click", toogle_dark_mode);
    cursor_button.removeEventListener("click", toogle_cursor);
    confirm_button.removeEventListener("click", confirm_alterations);
    cancel_button.removeEventListener("click", cancel_alterations);
    button_cco_informa.removeEventListener("click", restore_width_columns)

}
const restore_width_columns = ()=>{reset_width = !reset_width;update_color_spans()}
const open_config_menu = ()=>{
    menu_config.classList.add("revel");
    update_color_spans();
    dark_mode_button.addEventListener("click", toogle_dark_mode);
    cursor_button.addEventListener("click", toogle_cursor);
    confirm_button.addEventListener("click", confirm_alterations);
    cancel_button.addEventListener("click", cancel_alterations);
    button_cco_informa.addEventListener("click", restore_width_columns);
}

open_config.addEventListener("click", open_config_menu);
