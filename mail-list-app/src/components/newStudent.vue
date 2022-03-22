<template>
  <div id="add-student" class="card main-divs">
    <div class="content">
      <h3 class="title">Lägg till/Ändra elev</h3>
      <hr />
      <form class="form">
        <div class="select">
          <div>
            <label for="class">Klass: </label>
            <select name="class" id="" v-model="choosenClass">
              <optgroup label="EE">
                <option value="EE19">EE19</option>
                <option value="EE20">EE20</option>
                <option value="EE21">EE21</option>
              </optgroup>
              <optgroup label="ES">
                <option value="ES19">ES19</option>
                <option value="ES20">ES20</option>
                <option value="ES21">ES21</option>
              </optgroup>
              <optgroup label="TE">
                <option value="TE19">TE19</option>
                <option value="TE20">TE20</option>
                <option value="TE21">TE21</option>
              </optgroup>
            </select>
          </div>
          <div>
            <label for="class" v-if="choosenClass !== ''">Elev: </label>
            <select
              name="class"
              id=""
              v-model="choosenStudent"
              v-if="choosenClass !== ''"
              @change="setStudent"
            >
              <option value="">Ingen vald</option>
              <optgroup :label="'elever i ' + choosenClass">
                <option
                  v-for="student in studentsByClass"
                  :key="student.student_mail"
                  :value="student"
                >
                  {{ student.first_name }} {{ student.last_name }}
                </option>
              </optgroup>
            </select>
          </div>
        </div>
        <br />
        <div class="input-grid">
          <div class="student-div">
            <label for="fName">Namn elev: </label>
            <br />
            <input
              type="text"
              name="student_fName"
              placeholder="Elevens förnamn"
              v-model="newStudent.firstName"
            />
            <input
              type="text"
              name="student_lName"
              placeholder="Elevens efternamn"
              v-model="newStudent.lastName"
            />
            <br />
            <label for="student_email">E-post elev: </label>
            <br />
            <input
              type="text"
              name="student_email"
              id=""
              placeholder="Elevens e-post"
              v-model="newStudent.email"
            />
            <br />
            <label for="klass">klass: </label>
            <br />
            <select name="klass" id="drop" v-model="newStudent.class">
              <optgroup label="EE">
                <option value="EE19">EE19</option>
                <option value="EE20">EE20</option>
                <option value="EE21">EE21</option>
              </optgroup>
              <optgroup label="ES">
                <option value="ES19">ES19</option>
                <option value="ES20">ES20</option>
                <option value="ES21">ES21</option>
              </optgroup>
              <optgroup label="TE">
                <option value="TE19">TE19</option>
                <option value="TE20">TE20</option>
                <option value="TE21">TE21</option>
              </optgroup>
            </select>
            <br />
            <div class="select">
              <button @click.prevent="viewSubject">
                <i class="fas fa-plus green"></i> Lägg till ämnen
              </button>
            </div>
          </div>
          <div class="VH">
            <label for="VHfName">Namn VH: </label>
            <br />
            <input
              type="text"
              name="VHfName"
              placeholder="Vårdnadshavarens förnamn"
              v-model="newStudent.guardian1.FirstName"
            />
            <input
              type="text"
              name="VHlName"
              placeholder="Vårdnadshavarens efternamn"
              v-model="newStudent.guardian1.LastName"
            />
            <br />
            <label for="VHfName">E-post VH: </label>
            <br />
            <input
              type="text"
              name="VH_email"
              id=""
              placeholder="Vårdnadshavarens e-post"
              v-model="newStudent.guardian1.Email"
            />
            <br />
            <label for="VHfName">Namn VH 2: </label>
            <br />
            <input
              type="text"
              name="VHfName"
              placeholder="Vårdnadshavarens förnamn"
              v-model="newStudent.guardian2.FirstName"
            />
            <input
              type="text"
              name="VHlName"
              placeholder="Vårdnadshavarens efternamn"
              v-model="newStudent.guardian2.LastName"
            />
            <br />
            <label for="VHfName">E-post VH 2: </label>
            <br />
            <input
              type="text"
              name="VH_email"
              id=""
              placeholder="Vårdnadshavarens e-post"
              v-model="newStudent.guardian2.Email"
            />
          </div>
        </div>
        <br />
        <div class="save-button">
          <button @click.prevent="save">{{ spara }}</button>
        </div>
      </form>
    </div>
    <warning-modals v-if="warningModal" class="warning">
      <h3>
        {{ warning }}
      </h3>
    </warning-modals>
    <subjects v-if="subjectsModal" @close="closeSubject" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import warningModals from "./modals/newStudentWarning.vue";
import subjects from "./modals/newStudentSubjects.vue";
export default {
  components: {
    warningModals,
    subjects,
  },
  data() {
    return {
      warning: "",
      warningModal: false,
      subjectsModal: false,
      choosenClass: "",
      choosenStudent: "",
      newStudent: {
        class: "",
        firstName: "",
        lastName: "",
        email: "",
        guardian1: {
          FirstName: "",
          LastName: "",
          Email: "",
        },
        guardian2: {
          FirstName: "",
          LastName: "",
          Email: "",
        },
        Subjects: [],
      },
    };
  },
  methods: {
    ...mapGetters(["getStudentsByClass", "getNewStudentSubjects"]),
    ...mapActions(['createStudent']),
    addSubject() {
      this.addVHModal = true;
    },
    viewSubject() {
      this.subjectsModal = true;
    },
    closeSubject() {
      this.subjectsModal = false;
    },
    setStudent() {
      if (this.choosenStudent !== "") {
        this.newStudent.class = this.choosenStudent.class.trim();
        this.newStudent.firstName = this.choosenStudent.first_name.trim();
        this.newStudent.lastName = this.choosenStudent.last_name.trim();
        this.newStudent.email = this.choosenStudent.student_mail.trim();
        this.newStudent.guardian1.FirstName =
          this.choosenStudent.guardians[0].firstName.trim();
        this.newStudent.guardian1.LastName =
          this.choosenStudent.guardians[0].lastName.trim();
        this.newStudent.guardian1.Email =
          this.choosenStudent.guardians[0].mail.trim();
        this.newStudent.guardian2.FirstName =
          this.choosenStudent.guardians[1].firstName.trim();
        this.newStudent.guardian2.LastName =
          this.choosenStudent.guardians[1].lastName.trim();
        this.newStudent.guardian2.Email =
          this.choosenStudent.guardians[1].mail.trim();
      } else {
        this.newStudent.class = "";
        this.newStudent.firstName = "";
        this.newStudent.lastName = "";
        this.newStudent.email = "";
        this.newStudent.guardian1.FirstName = "";
        this.newStudent.guardian1.LastName = "";
        this.newStudent.guardian1.Email = "";
        this.newStudent.guardian2.FirstName = "";
        this.newStudent.guardian2.LastName = "";
        this.newStudent.guardian2.Email = "";
      }
    },
    warnings() {
      if (this.newStudent.class === "") return (this.warning = "Lägg till studentens klass");
      else if (this.newStudent.firstName === "")
        return (this.warning = "lägg till studentens förnamn");
      else if (this.newStudent.lastName === "")
        return (this.warning = "Lägg till studentens efternamn");
      else if (this.newStudent.email === "")
        return (this.warning = "Lägg till studentens email");
    },
    save() {
      this.warnings();
      if (this.warning !== "") {
        setTimeout(() => {
          this.warningModal = false;
          this.warning = "";
        }, 2000);
        return (this.warningModal = true);
      }
      this.createStudent(this.newStudent)
    },
  },
  computed: {
    studentsByClass() {
      return this.getStudentsByClass()(this.choosenClass);
    },
    spara() {
      if (this.choosenStudent !== "") return "Spara";
      else return "Skapa";
    },
    setSubjects() {
      return this.getNewStudentSubjects();
    },
  },
};
</script>

<style scoped>
#add-student {
  display: grid;
  grid-template-columns: 100%;
  grid-template-areas: "nr1";
}
.content{
  grid-area: nr1;
}
.input-grid {
  display: grid;
  grid-template-columns: 50% 50%;
}
input {
  margin: 2% 0 0 0;
}
#drop {
  margin: 3% 0 0 0;
  width: 80%;
}
.select {
  margin-top: 3%;
}
i {
  color: green;
}
.save-button {
  text-align: center;
}
.warning{
  grid-area: nr1;
  z-index: 1000;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>