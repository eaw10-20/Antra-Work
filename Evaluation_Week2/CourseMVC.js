import { Api } from "./CourseAPI.js";

// View
const View = (() => {

    const domstr = {
        availContainer: "#available-container",
        selectedContainer: "#selected-container",
        availCourse: ".course-element",
        selectButton: "#course-submit"
    };

    const render = (ele, tmp) => {
        ele.innerHTML = tmp;
    };

    const createCourseElm = (courses, header) => {
        let tmp = `
        <li class="list-element list-header">
            ${header}
        </li>
        `;
        courses.forEach((course) => {
            tmp += `
                <li class="list-element course-element", id="course-${course.courseId}">
                    ${course.courseName}<br>
                    Course type: ${course.required ? "Compulsitory" : "Elective"}<br>
                    Course Credit: ${course.credit}
                </li>
            `
        });
        return tmp;
    };

    const updateCreditElm = (credits) => {
        return `Total Credits: ${credits}`
    };

    return{
        domstr, render, createCourseElm, updateCreditElm
    };
})();

// Model
const Model = ((api, view) => {
    class AvailableList {
        available = [];
        selected = [];
        
        getAvailable(){
            return this.available;
        }

        setAvailable(courses){
            this.available = [...courses];
            
            const availContainer = document.querySelector(view.domstr.availContainer);


            const addToAvail = (event) => {
                event.target.classList.add("selected");
            }

            const tmp = view.createCourseElm(this.available, "Available Courses");
            view.render(availContainer, tmp);
        }

        moveSelected(){
            const selectedContainer = document.querySelector(view.domstr.selectedContainer);

            const notSelected = [];

            for(let courseEle of document.getElementsByClassName("course-element")){
                let selectedId = +courseEle.id.substring(7);
                let course = this.available.find(element => element.courseId === selectedId);
                if(courseEle.classList.contains("selected")) this.selected.push(course);
                else notSelected.push(course);
                }
            const tmp = view.createCourseElm(this.selected, "Selected Courses");
            view.render(selectedContainer, tmp);

            this.setAvailable(notSelected);
        }
    }

    class CreditHandler{
        constructor() {
            this.credits = 0;
            this.maxCredits = 18;
        }

        getCredits() {
            return this.credits;
        }

        updateCredits(){
            const creditContainer = document.getElementById("credit-count");
            const tmp = view.updateCreditElm(this.credits);
            view.render(creditContainer, tmp);
        }

        modifyCreditCount(id, list, selected) {

            const course = list.available.find(element => element.courseId === id);
            if(!selected && this.credits + course.credit > this.maxCredits) return false;
            else{
                if(selected) this.credits -= course.credit;
                else this.credits += course.credit;

                this.updateCredits();

                return true;
            }
        }
    }

    const getCourses = api;

    return {
        getCourses, AvailableList, CreditHandler
    }
})(Api, View);

// Controller

const Controller = ((model, view) => {

    const availableList = new model.AvailableList();
    const creditHandler = new model.CreditHandler();

    const init = () => {
        model.getCourses().then((available) => {
            availableList.setAvailable(available);
            creditHandler.updateCredits();
        });
    };

    const selectCourse = () => {
        const availContainer = document.querySelector(view.domstr.availContainer);
        availContainer.addEventListener("click", (event) => {
            let eve = event.target;
            let selectedId = +eve.id.substring(7)
            let selected = eve.classList.contains("selected")

            if(creditHandler.modifyCreditCount(selectedId, availableList, selected)){
                selected ? eve.classList.remove("selected") : eve.classList.add("selected");
            }
            else{
                alert("You can only choose up to 18 credits in one semester.")
            }
            
        });
    }

    const confirmCourses = () => {
        const selectButton = document.querySelector(view.domstr.selectButton);
        selectButton.addEventListener("click", (event) => {
            if(confirm(`You have chosen ${creditHandler.getCredits()} credits for this semester. You cannot change once you submit. Do you want to confirm?`)){
                availableList.moveSelected();
                selectButton.disabled = true;
            };
        });
    }

    const bootstrap = () => {
        init();
        selectCourse();
        confirmCourses();
    };

    return {
        bootstrap
    };
})(Model, View);

Controller.bootstrap();