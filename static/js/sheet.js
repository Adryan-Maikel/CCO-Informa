const menu_buttons = document.querySelectorAll("li button")
function remove_class_elements(list_elements, _class){
    for(const element of list_elements)
        element.parentElement.classList.remove(_class);
}
remove_class_elements(menu_buttons, "active");
for(const button of menu_buttons){
    if(document.querySelector(`caption.${button.id}`))
        button.parentElement.classList.add("active");
    button.addEventListener("click", (event)=>window.location.href = `/sheets/${event.target.id}`);
}

const buttons_del = document.querySelectorAll(".del");
for(const button of buttons_del){
    button.addEventListener("click", (event)=>{
        const row = event.target.id.replace("del-", "");
        const div_buttons = document.querySelector(`#btns-r${row}`);
        div_buttons.classList.add("revel");
        const tr = event.target.parentElement.parentElement;
        tr.classList.add("remove");
        div_buttons.querySelector(`#cancel-${row}`).addEventListener("click", ()=>{
            tr.classList.remove("remove");
            div_buttons.classList.remove("revel");
        });
        div_buttons.querySelector(`#confirm-${row}`).addEventListener("click", ()=>{
            div_buttons.classList.remove("revel");

        });
    })
}
const buttons_edit = document.querySelectorAll(".edit")
for(const button of buttons_edit){
    button.addEventListener("click", (event)=>{
        const row = event.target.id.replace("edit-", "");
        const inputs = document.querySelectorAll(`#row-${row} td input`);
        const inputs_value = {};
        for(const input of inputs){
            input.removeAttribute("disabled");
            inputs_value[input.id] = input.value;
        }
        const div_buttons = document.querySelector(`#btns-r${row}`);
        div_buttons.classList.add("revel");

        div_buttons.querySelector(`#confirm-${row}`).addEventListener("click", (_)=>{
            div_buttons.classList.remove("revel");
            for(const input of inputs){
                input.setAttribute("disabled", "true")
                if(inputs_value[input.id] == input.value)
                    continue;
                console.log(input.value);
            }
        })
        div_buttons.querySelector(`#cancel-${row}`).addEventListener("click", (_)=>{
            div_buttons.classList.remove("revel");
            for(const input of inputs){
                input.setAttribute("disabled", "true");
                input.value=inputs_value[input.id];
            }
        });
    });
}