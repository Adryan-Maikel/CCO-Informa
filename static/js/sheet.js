const menu_buttons = document.querySelectorAll("li button")
function remove_class_elements(list_elements, _class){
    for(const element of list_elements)
        element.parentElement.classList.remove(_class);
}
remove_class_elements(menu_buttons, "active")
for(const button of menu_buttons){
    // const capition = document.querySelector(`caption.${button.id}`)
    if(document.querySelector(`caption.${button.id}`))button.parentElement.classList.add("active")
    button.addEventListener("click", (event)=>{
        window.location.href = `/edit/${event.target.id}`
    })
}
const buttons = document.querySelectorAll(".buttons button")
for(const button of buttons){
    button.addEventListener("click", (event)=>{
        const row = event.target.id.replace("edit-", "");
        const inputs = document.querySelectorAll(`#row-${row} td input`)
        for(const input of inputs){
            input.removeAttribute("disabled")
            const div_buttons = document.querySelector(`#btns-r${row}`)
            div_buttons.classList.add("revel")
        }
    })
}