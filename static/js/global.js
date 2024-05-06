const create_cookie_configurations=()=>{
    const configurations=JSON.stringify({cursor_personalizado: true,dark_mode: false});
    const expires="Fri, 31 Dec 9999 23:59:59 GMT";
    document.cookie=`configurations=${configurations}; expires=${expires}; path=/`;
    return JSON.parse(decodeURIComponent(configurations));
}
const load_cookie_configurations=()=>{
    var cookie=document.cookie.split(';').find(cookie => cookie.trim().startsWith('configurations='));
    if (cookie) {
        var configurations=cookie.split('=')[1];
        return JSON.parse(decodeURIComponent(configurations));
    } else {
        return create_cookie_configurations();
    }
}
const update_cookie_configurations=(new_configurations)=>{
    const expires="Fri, 31 Dec 9999 23:59:59 GMT";
    document.cookie=`configurations=${JSON.stringify(new_configurations)}; expires=${expires}; path=/`
    window.location.reload();
}
const toogle_option_menu=(configurations, option)=>{
    configurations[option]=!configurations[option];
    return configurations;
}

/* DARK-MODE */
const load_dark_mode=(configurations)=>{
    if(configurations.dark_mode){
        document.documentElement.style.setProperty("--white", "#101b57")
        document.documentElement.style.setProperty("--dark", "#EDEDED")
    }else{
        document.documentElement.style.setProperty("--white", "#EDEDED")
        document.documentElement.style.setProperty("--dark", "#101b57")
    }
}

const CURSORS = {
    default:"/static/assets/normal.cur",danger:"/static/assets/unavailable.cur",link:"/static/assets/link.cur",
    move:"/static/assets/move.cur",scroll_x:"/static/assets/horizontal.cur",scroll_y:"/static/assets/vertical.cur"
}
const set_cursor= function(cursor){
    return document.documentElement.style.setProperty("--cursor", `url(${cursor}), auto`);
}

/* CURSOR */
const buttons = document.querySelectorAll("button")
const inputs = document.querySelectorAll("input")

const load_cursor = (configurations) => {
    // document.addEventListener("contextmenu", (event)=>event.preventDefault())
    if(!configurations.cursor_personalizado)return;

    // document.documentElement.style.setProperty("--cursor", `url(${CURSORS.default}), auto`);
    set_cursor(CURSORS.default)
    document.addEventListener("mousedown", (event)=>{if(event.button!=0)event.preventDefault()});
    buttons.forEach(button=>{
        button.addEventListener("mouseenter", event=>{
            const cursor = event.target.disabled?CURSORS.danger:CURSORS.link
            set_cursor(cursor)
        })
    });
    
    // for(const button of buttons){
    //     button.addEventListener("mouseenter", (event)=>{event.target.disabled?set_cursor(CURSORS.link):set_cursor(CURSORS.danger)
    //         event.target.addEventListener("mouseout", ()=>set_cursor(CURSORS.default))
    //     })
    // }
    for(const input of inputs){
        if(input.disabled){
            const parent = input.parentElement;
            parent.addEventListener("mouseenter", ()=>{
                document.documentElement.style.setProperty("--cursor", `url(${CURSORS.danger}), auto`)
                parent.addEventListener("mouseout", ()=>{
                        document.documentElement.style.setProperty("--cursor", `url(${CURSORS.default}), auto`)            
                })
            })
        }
    }
}


const configurations = load_cookie_configurations()
load_dark_mode(configurations)
load_cursor(configurations)

export{ load_cookie_configurations, toogle_option_menu, load_dark_mode, update_cookie_configurations, load_cursor }