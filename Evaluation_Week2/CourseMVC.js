import { Api } from "./CourseAPI.js";

// View
const View = (() => {

    const domstr = {
        availContainer: "#available-container",
        availCourse: ".course-element"
    };

    const render = (ele, tmp) => {
        ele.innerHTML = tmp;
    };

    const createCourseElm = (courses) => {
        let tmp = `
        <li class="list-element list-header">
            Available Courses
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
    }

    return{
        domstr, render, createCourseElm, updateCreditElm
    };
})();

// Model
const Model = ((api, view) => {
    class AvailableList {
        available = [];
        
        getAvailable(){
            return this.available;
        }

        setAvailable(courses){
            this.available = [...courses];
            
            const availContainer = document.querySelector(view.domstr.availContainer);


            const addToAvail = (event) => {
                event.target.classList.add("selected");
            }

            const tmp = view.createCourseElm(this.available);
            view.render(availContainer, tmp);
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
            let selectedId = eve.id.substring(7)
            console.log(selectedId);
            eve.classList.contains("selected") ? eve.classList.remove("selected") : eve.classList.add("selected");
        })
    }

    const bootstrap = () => {
        init();
        selectCourse();
    };

    return {
        bootstrap
    };
})(Model, View);

Controller.bootstrap();