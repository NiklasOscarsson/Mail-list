<template>
  <div id="add-student" class="card main-divs">
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
        <label for="fName">Namn elev: </label>
        <br>
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
        <br>
        <label for="student_email">E-post elev: </label>
        <br>
        <input
          type="text"
          name="student_email"
          id=""
          placeholder="Elevens e-post"
          v-model="newStudent.email"
        />
        <label for="klass">klass: </label>
        <select name="klass" id="" v-model="newStudent.class">
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
      <div class="input-grid">
        <label for="VHfName">Namn VH: </label>
        <br>
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
        <br>
        <label for="VHfName">E-post VH: </label>
        <br>
        <input
          type="text"
          name="VH_email"
          id=""
          placeholder="Vårdnadshavarens e-post"
          v-model="newStudent.guardian1.Email"
        />
      </div>
      <div class="input-grid">
        <label for="VHfName">Namn VH 2: </label>
        <br>
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
        <br>
        <label for="VHfName">E-post VH: </label>
        <br>
        <input
          type="text"
          name="VH_email"
          id=""
          placeholder="Vårdnadshavarens e-post"
          v-model="newStudent.guardian2.Email"
        />
      </div>
      <br />
      <div class="select">
        <button @click.prevent="viewSubject">
          <i class="fas fa-plus green"></i> Lägg till ämnen
        </button>
      </div>
      <br />
      <div class="save-button"><button>{{spara}}</button></div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      choosenClass: "",
      choosenStudent: "",
      newStudent: {
        class: '',
        firstName: '',
        lastName:'',
        email: '',
        guardian1: {
          FirstName: '',
          LastName: '',
          Email: '',
        },
        guardian2: {
          FirstName: '',
          LastName: '',
          Email: '',
        },
        Subjects: this.setSubjects,
      },
    };
  },
  methods: {
    ...mapGetters(['getStudentsByClass', 'getNewStudentSubjects']),
    addSubject() {
      this.addVHModal = true;
    },
    viewSubject() {
      this.addSubjectModal = true;
    },
    setStudent(){
      this.newStudent.class = this.choosenStudent.class.trim()
      this.newStudent.firstName = this.choosenStudent.first_name.trim()
      this.newStudent.lastName = this.choosenStudent.last_name.trim()
      this.newStudent.email = this.choosenStudent.student_mail.trim()
      this.newStudent.guardian1.FirstName = this.choosenStudent.guardians[0].firstName.trim()
      this.newStudent.guardian1.LastName = this.choosenStudent.guardians[0].lastName.trim()
      this.newStudent.guardian1.Email = this.choosenStudent.guardians[0].mail.trim()
      this.newStudent.guardian2.FirstName = this.choosenStudent.guardians[1].firstName.trim()
      this.newStudent.guardian2.LastName = this.choosenStudent.guardians[1].lastName.trim()
      this.newStudent.guardian2.Email = this.choosenStudent.guardians[1].mail.trim()
    }
  },
  computed:{
    studentsByClass(){
      return this.getStudentsByClass()(this.choosenClass)
    },
    spara(){
      if(this.choosenStudent !== '') return 'Spara'
      else return 'Skapa'
    },
    setSubjects(){
      return this.getNewStudentSubjects()
    }
  }
};
</script>

<style scoped>
  .input-grid{
    margin-bottom: 2vh;
  }
  i{
    color: green;
  }
  .save-button{
    text-align: center;
  }
</style>