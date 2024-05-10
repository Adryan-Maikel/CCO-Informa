import { width_columns_default, update_cookie_width_columns, load_cookie_width_columns } from "./cco-informa-config.js";
function set_value_in_property(property, value){document.documentElement.style.setProperty(property, `${value}px`)}

const wdt_columns = load_cookie_width_columns();
Object.entries(wdt_columns).forEach(([column, width])=>{set_value_in_property(`--${column}`, width);wdt_columns.sum += width;})

const table_cco_informa = document.getElementById("cco-informa");
function adjust_width_table(width){table_cco_informa.style.width = width <= wdt_columns.sum + 44?`100%`:`${wdt_columns.sum + 44}px`}

adjust_width_table(window.innerWidth);
window.addEventListener("resize", event=>adjust_width_table(event.target.innerWidth));

/* Botões */
var startX = 0;
var clicked = false;
var column_focus = "";

document.querySelectorAll("button.expand").forEach(button=>button.addEventListener("mousedown", click_button));

function click_button(event) {
    column_focus = event.target.id.replace("expand-", "")
    startX = event.clientX;
    clicked = true;
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseleave", removeEvents)
    document.addEventListener("mouseup", confirm_resize);
}

var width = 0;

function resize(event) {
    const diff_x = event.clientX - startX;
    width = wdt_columns[column_focus] + diff_x
    set_value_in_property(`--${column_focus}`, width);
}

function confirm_resize(event){
    wdt_columns[column_focus] = width;
    update_cookie_width_columns(wdt_columns);
    removeEvents(event);
}

function removeEvents(event) {
    if (clicked) {
        document.removeEventListener("mousemove", resize);
        document.removeEventListener("mouseleave", removeEvents)
        document.removeEventListener("mouseup", removeEvents);
    }
    clicked = false;
}
