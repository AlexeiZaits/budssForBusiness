const initialProject = () => {
    cookiesWithModal.open();
    handleEventsListener(".open__form")
    handleEventListener(".open__menu")
    setYear("timeYear")
    window.addEventListener('scroll', () => handleScroll(".header__section"));
}

function handleEventListener(className){
    const element = document.querySelector(className)
    element.addEventListener("click", () => menu.open())
}

function handleEventsListener(className){
    const elements = document.querySelectorAll(className)
    
    elements.forEach(element => {
        element.addEventListener("click", () => form.open())
    })
}

function setYear(id){
    const yearElement = document.getElementById(id);
    const now = new Date();
    const year = now.getFullYear();
    yearElement.innerText = year;
}

function handleScroll(className){
    const headerSection = document.querySelector(className);
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 100) {
        headerSection.classList.add('hidden');
    } else if(scrollPosition < 37) {
        headerSection.classList.remove('hidden');
    }
}

// modal
class Modal {
    constructor({ content = "", className = "", outsideClick = true} = {}) {
        this.content = content;
        this.className = className;
        this.outsideClick = outsideClick
        this.modalElement = null
        this.buttonSubmit = null
        this.inputsContainer = null
        this.eventClose = this.handleOutsideClick.bind(this);
    }
    
    render() {
        const modal = document.createElement('div');
        modal.classList.add("modal");
        
        if(this.className){
            modal.classList.add(`modal__${this.className}`)
        }
        
        modal.innerHTML = `
        <div class="modal__content ${this.className ? `modal__content-${this.className}`: ""}">
            <div class="modal__body ${this.className ? `modal__body-${this.className}`: ""}">${this.content}</div>
        </div>
        `;
        
        document.body.appendChild(modal);
        this.modalElement = modal
    }

    open() {
        this.render();
        this.init();
        if (this.outsideClick) document.body.style.overflow = "hidden"
    }
    
    close() {
        this.eventClose && this.outsideClick && window.removeEventListener("click", this.eventClose);
        if (this.outsideClick) document.body.style.overflow = "visible"

        if (this.modalElement) {
            this.modalElement.remove();
            this.modalElement = null;
        }
    }

    init() {
        const closeButtons = document.querySelectorAll('.close__modal');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => this.close());
        });
        
        this.outsideClick && window.addEventListener('click', this.eventClose);
    }

    handleOutsideClick(event) {
        if (event.target.classList.contains("modal")) {
            this.close();
        }
    }
}

// thanks
const thanksWithModal = new Modal({
    className: "thanks",
    content: `<div class="thanks">
                <div class="close__container"><button class="close__icon close__modal"></button></div>
                <div class="thanks__icon">
                    <img src="./assets/icons/thanks.svg">
                </div>
                <p class="ST1 thanks__title">Thank you!</p>
                <p class="ST3 thanks__description">Thank you, we have received your application and will contact you soon!</p>
                <button class="ST4 button primary thanks__button close__modal">Super!</button>
            </div>`,
});

// cookies
 const cookiesWithModal = new Modal({
    className: "cookies",
    content: `<div class="cookies">
                <div class="close__container"><button class="close__icon close__modal"></button></div>
                <p class="ST7 cookies__text">This website uses cookies to ensure you get the best experience on our website. They also allow us to analyze user behavior in order to constantly improve the website for you.</p>
                <div class="cookies__buttons">
                    <button  class="ST4 button primary cookies__buttons-accept close__modal">Accept</button>
                    <button  class="ST4 button primary cookies__buttons-decline close__modal">Decline</button>
                </div>
            </div>`,
    outsideClick: false,
    
});

//menu
class menuWithModal extends Modal{
    constructor(modal){
        super(modal)
    }
    
    init(){
        super.init();
        this.modalElement.querySelector(".open__form").addEventListener("click", () => this.openForm())
    }

    openForm(){
        this.close();
        form.open();
    }
}

const menu = new menuWithModal({
    className: "menu",
    content: ` <div class="close__container"><button class="close__icon secondary close__modal"></button></div>
            <button class="ST4 button primary open__form">Contact sales</button>
            <nav class="menu__nav">
                <a class="ST5 menu__nav-link close__modal" href="#">For Business</a>
                <a class="ST5 menu__nav-link close__modal" href="#">For Customers</a>
                <a class="ST5 menu__nav-link close__modal" href="#">Privacy Policy</a>
                <a class="ST5 menu__nav-link close__modal" href="#">Terms Of Use - Seller</a>
                <a class="ST5 menu__nav-link close__modal" href="#">Terms of Use - Sellers & Customers</a>
            </nav>
            `,
})

// form
class formWithModal extends Modal{
    constructor(modal){
        super(modal)
        this.validateForm = {name: false, email: false, phone: false}
        this.inputsContainer = null;
    }
    
    init(){
        super.init();
        this.buttonSubmit = this.modalElement.querySelector("#buttonSubmit");
        const inputs = ["#inputName", "#inputEmail", "#inputPhone"];
        
        this.formError = this.modalElement.querySelector("#formError")
        this.buttonSubmit.addEventListener("submit", (event) => this.handleSubmit(event))
        
        this.inputsContainer = inputs.map(item => {
            return {
                elementError: this.modalElement.querySelector(item+"Error"),
                elementContainer:  this.modalElement.querySelector(item+"Container"),
                key: item,
                check: false
            }
        })
        
        inputs.forEach(item => {
            const input = this.modalElement.querySelector(item);
            input.addEventListener("input", (event) => this.handleChange(event, item))
            input.addEventListener("blur", (event) => this.handleBlur(event, item))
            input.addEventListener("focus", () => this.handleFocus(item))
            input.addEventListener("keydown", (event) => {
                if (event.key === "Enter") this.handleSubmit(event)
            })
        })
    }
    
    setErrorElements(){
        let check = true;

        this.inputsContainer.forEach((item) => {
            if (!item.check){
                check = false
                const valueLength = item.elementContainer.querySelector(item.key).value.length;
                this.setErrorElement(item, valueLength)
            }
        })

        if (!check){

        }
        
    }
    
    handleSubmit(event){
        event.preventDefault();
        
        if (this.checkValidateForm()){
            const form = event.target;
            const formData = new FormData(form);
            const values = Object.fromEntries(formData.entries());
            console.log(values)
            this.close()
            
            thanksWithModal.open();
        } else{
            this.formError.style.display = "block"
            this.setErrorElements()
        }
    }

    checkValidateForm(){
        let check = true
        this.inputsContainer.forEach(item => {
            if (!item.check) check = false
        })
        
        this.changeActiveSubmit(check)

        return check
    }
    
    setErrorElement(element, length){
        const errorText = {required: "This field is required.", invalidNumber: "Invalid phone number."}
        element.elementContainer.classList.add("error");
        
        if (element.key === "#inputPhone"){
            if (length === 0){
                element.elementError.innerText = errorText.required
            } else {
                element.elementError.innerText = errorText.invalidNumber
            }
        } else {
            element.elementError.classList.add("error");
            element.elementError.innerText = errorText.required
        }
    }

    handleFocus(key){
        const element = this.inputsContainer.find((item) => item.key === key)
        if (element.elementContainer.classList.contains("error")){
            element.elementContainer.classList.remove("error");
            element.elementError.innerText = "";
        }
    }
    
    handleBlur(event, key){
        const element = this.inputsContainer.find((item) => item.key === key)

        switch  (key) {
            case "#inputName":
                if (!element.check) {
                    this.setErrorElement(element, event.target.value.length)
                }
                break;
            
            case "#inputEmail":
                if (!element.check) {
                    this.setErrorElement(element, event.target.value.length)
                }
                break;
                
            case "#inputPhone":
                if (!element.check) {
                    this.setErrorElement(element, event.target.value.length)
                }
                break;
            
            default:
                break;
        }
    }
    
    handleChange(event, key){
        switch  (key) {
            case "#inputName":
                this.validateName(event)
                break;
            
            case "#inputEmail":
                this.validateEmail(event)
                break;
                
            case "#inputPhone":
                this.validatePhone(event)
                break;
            
            default:
                break;
        }
        this.checkValidateForm()
    }

    changeActiveSubmit(check){
        if (this.buttonSubmit.classList.contains('unactive') && check) {
            this.buttonSubmit.classList.remove('unactive');
        } else if (!check) {
            this.buttonSubmit.classList.add('unactive');
        }
    }
    
    checkForm(key, length){
        const elementIndex = this.inputsContainer.findIndex((item) => item.key === key)
        if (key === "#inputPhone"){
            this.inputsContainer[elementIndex].check = length === 16;
        } else {
            this.inputsContainer[elementIndex].check = length !== 0
        }
        
        return this.inputsContainer[elementIndex].check
    }

    validateName(event){
        return this.checkForm("#inputName", event.target.value.length)
    }

    validateEmail(event){
        return this.checkForm("#inputEmail", event.target.value.length)
    }
    
    validatePhone(event){
        let value = event.target.value.replace(/\D/g, '');
        
        let formatted = '+7 ';
        if (value.length > 1) formatted += `${value.slice(1, 4)} `;
        if (value.length >= 4) formatted += `${value.slice(4, 7)} `;
        if (value.length >= 7) formatted += `${value.slice(7, 9)} `;
        if (value.length >= 9) formatted += `${value.slice(9, 11)}`;

        event.target.value = formatted.trim();

        return this.checkForm("#inputPhone", formatted.length)
    }
}


const form = new formWithModal({
    className: "form",
    content: `<form onsubmit="form.handleSubmit(event)" class="form">
                <div class="close__container"><button class="close__icon close__modal"></button></div>
                <div id="inputNameContainer" class="form__input input">
                    <p class="B3 input__title">Name</p>
                    <div class="input__container">
                        <input id="inputName" name="name" class="B4 input__field" type="text" placeholder="Enter name">
                        <span class="loader"></span>
                        <p id="inputNameError" class="B7 input__error"></p>
                    </div>
                </div>
                <div id="inputEmailContainer" class="form__input input ">
                    <p class="B3 input__title">Email</p>
                    <div class="input__container">
                        <input class="B4 input__field" name="email" id="inputEmail" type="text" placeholder="Enter email">
                        <span class="loader"></span>
                        <p id="inputEmailError" class="B7 input__error"></p>
                    </div>
                </div>
                <div id="inputPhoneContainer" class="form__input input">
                    <p class="B3 input__title">Phone number</p>
                    <div class="input__container">
                        <img class="input__flag" src="./assets/icons/russian-federation.svg">
                        <input id="inputPhone" name="phone" class="B4 input__field input__field-phone" placeholder="+7 000 000 00 00" type="tel" placeholder="Enter number">
                        <span class="loader"></span>
                        <p id="inputPhoneError" class="B7 input__error"></p>
                    </div>
                </div>
                <div class="form__input input">
                    <p class="B3 input__title optional">Company</p>
                    <div class="input__container">
                        <input class="B4 input__field" name="company" type="text" placeholder="Enter company">
                    </div>
                </div>
                <div class="form__input input">
                    <p class="B3 input__title optional">Website/Store URL</p>
                    <div class="input__container">
                        <input class="B4 input__field" type="text" name="url" placeholder="Enter Website/Store URL">
                    </div>
                </div>
                <p id="formError" class="B2 form__error">
                    Please fill in all required fields
                </p>
                <div class="form__info">
                    <p class="B5 form__text">
                        By submitting this form you are agreeing to Budss’s
                        <a class="B6 form__link">Privacy Policy</a> 
                        and
                        <a class="B6 form__link">Terms of Use</a>
                    </p>
                </div>
                <div class="form__button">
                    <button type="submit" id="buttonSubmit" class="ST4 button primary unactive">Contact sales</button>
                </div>
            </form>`,
});

initialProject()
