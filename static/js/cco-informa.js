const table_cco_informa = document.getElementById("cco-informa");
function adjust_width_table(width){
    table_cco_informa.style.width = width <= wdt_columns.sum?`100%`:`${wdt_columns.sum + 44}px`;
}


const wdt_columns = {_: 30,A: 80,B: 80,C: 55,D: 57,E: 84,F: 47,G: 63,H: 312,I: 215,J: 400,K: 80, sum: 0}
for(const [column, width] of Object.entries(wdt_columns)){
    document.documentElement.style.setProperty(`--${column}`, `${width}px`);
    wdt_columns.sum += width;
}
adjust_width_table(window.innerWidth);
window.addEventListener("resize", event=>adjust_width_table(event.target.innerWidth));