export function initFormField(elemId, placeholder){
    document.getElementById(elemId).addEventListener('change', (event)=>{
        if(event.target.value.length > 0)
            event.target.placeholder = ''
    })
    document.getElementById(elemId).addEventListener('blur', (event)=>{
        event.target.placeholder = placeholder
    })
}

