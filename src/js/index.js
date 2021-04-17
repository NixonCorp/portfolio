import '../scss/styles.scss'
import './form-field-module'
import CSSKeyframer from 'css-keyframer'
import {initFormField} from "./form-field-module";
console.log('Hello World from index main file!')
initFormField('contact-name', 'Enter your name')
initFormField('contact-email', 'Enter your email')
initFormField('contact-message', 'Write your message')
document.addEventListener('readystatechange', (event) => {
    if(document.readyState === 'complete'){
            document.getElementsByClassName('contact__form-fields')[0].style.cssText = 'margin-left:0px !important'
            const formFields = document.getElementsByClassName('contact__form-field')
            for(let i = 0;i < formFields.length;i++){
                formFields[i].style.cssText = 'margin-left:0px !important'
            }

    }
});


