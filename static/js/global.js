/* COOKIES */
function create_cookie_configurations(){
    const configurations=JSON.stringify({cursor_personalizado:true,dark_mode:false});
    document.cookie=`configurations=${configurations}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
    return JSON.parse(decodeURIComponent(configurations));
}
function load_cookie_configurations(){
    return document.cookie.split(";").find(cookie=>cookie.trim().startsWith("configurations="))
    ?JSON.parse(decodeURIComponent(document.cookie.split(";").find(cookie=>cookie.trim().startsWith("configurations=")).split("=")[1]))
    :create_cookie_configurations
}
function update_cookie_configurations(new_configurations){
    document.cookie=`configurations=${JSON.stringify(new_configurations)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
    window.location.reload()
}
function toogle_option_menu(configurations, option){
    configurations[option]=!configurations[option];
    return configurations
}

/* DARK-MODE */
function load_dark_mode(configurations){
    const colors={white:"#EDEDED","dark":"#05081A"}
    const element=document.documentElement;
    if(configurations.dark_mode){
        element.style.setProperty("--white", colors.dark);
        element.style.setProperty("--dark", colors.white);
        return;
    }
    element.style.setProperty("--white", colors.white);
    element.style.setProperty("--dark", colors.dark)
}

/* CURSOR */
const CURSORS={
    default:"/static/assets/normal.cur",danger:"/static/assets/unavailable.cur",link:"/static/assets/link.cur",
    move:"/static/assets/move.cur",scroll_x:"/static/assets/horizontal.cur",scroll_y:"/static/assets/vertical.cur"
}
function set_cursor(cursor){
    return document.documentElement.style.setProperty("--cursor", `url(${cursor}), auto`);
}

function load_cursor(configurations){
    if(!configurations.cursor_personalizado)return;
    set_cursor(CURSORS.default);
    document.addEventListener("mousedown",(event)=>{if(event.button!=0)event.preventDefault()});
    document.querySelectorAll("button").forEach(button=>{
        button.addEventListener("mouseenter", event=>{
            set_cursor(event.target.disabled?CURSORS.danger:CURSORS.link);
            button.addEventListener("mouseout", _=>set_cursor(CURSORS.default))
        })
    });
    document.querySelectorAll("input").forEach(input=>{
        if(input.disabled){
            const parent=input.parentElement;
            parent.addEventListener("mouseenter", _=>{
                set_cursor(CURSORS.danger);
                parent.addEventListener("mouseout", _=>set_cursor(CURSORS.default))
            })
        }
    })
}


const configurations=load_cookie_configurations()
load_dark_mode(configurations)
load_cursor(configurations)

export{ configurations, load_cookie_configurations, toogle_option_menu, load_dark_mode, update_cookie_configurations, load_cursor }