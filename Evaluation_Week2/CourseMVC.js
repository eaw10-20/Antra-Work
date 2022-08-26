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

    return{
        domstr, render, createCourseElm
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

    const getCourses = api;

    return {
        getCourses, AvailableList
    }
})(Api, View);

// Controller

const Controller = ((model, view) => {

    const availableList = new model.AvailableList();

    const init = () => {
        model.getCourses().then((available) => {
            availableList.setAvailable(available);
        });
    };

    const selectCourse = () => {
        const availContainer = document.querySelector(view.domstr.availContainer);
        availContainer.addEventListener("click", (event) => {
            let eve = event.target;
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