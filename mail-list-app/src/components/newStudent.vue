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
          >
            <option value="">Ingen vald</option>
            <optgroup :label="'elever i ' + choosenClass">
              <option
                v-for="student in schoolClass"
                :key="student.student_mail"
                :value="student"
              >
                {{ student.first_name + " " + student.last_name }}
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
          v-model="newStudent.studentFirstName"
        />
        <input
          type="text"
          name="student_lName"
          placeholder="Elevens efternamn"
          v-model="newStudent.studentLastName"
        />
        <br>
        <label for="student_email">E-post elev: </label>
        <br>
        <input
          type="text"
          name="student_email"
          id=""
          placeholder="Elevens e-post"
          v-model="newStudent.studentEmail"
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
          v-model="newStudent.guardianFirstName"
        />
        <input
          type="text"
          name="VHlName"
          placeholder="Vårdnadshavarens efternamn"
          v-model="newStudent.guardianLastName"
        />
        <br>
        <label for="VHfName">E-post VH: </label>
        <br>
        <input
          type="text"
          name="VH_email"
          id=""
          placeholder="Vårdnadshavarens e-post"
          v-model="newStudent.guardianEmail"
        />
      </div>
      <div class="input-grid" v-if="student.guardian2_first_name">
        <label for="VHfName">Namn VH: </label>
        <input
          type="text"
          name="VHfName"
          placeholder="Vårdnadshavarens förnamn"
          v-model="newStudent.guardianFirstName"
        />
        <br />
        <input
          type="text"
          name="VHlName"
          placeholder="Vårdnadshavarens efternamn"
          v-model="newStudent.guardianLastName"
        />
        <label for="VHfName">E-post VH: </label>
        <input
          type="text"
          name="VH_email"
          id=""
          placeholder="Vårdnadshavarens e-post"
          v-model="newStudent.guardianEmail"
        />
      </div>
      <br />
      <div class="select">
        <button @click="addSubject">
          <i class="fas fa-plus green"></i> Lägg till vårdnadshavare
        </button>
        <button @click="viewSubject">
          <i class="fas fa-plus green"></i> Lägg till ämne
        </button>
      </div>
      <br />
      <div class="save-button"><button>Spara</button></div>
    </form>
  </div>
</template>

<script>
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
      },
      student: '',
      subjects: [],
    };
  },
  methods: {
    addSubject() {
      this.addVHModal = true;
    },
    viewSubject() {
      this.addSubjectModal = true;
    },
  },
};
</script>

<style scoped>
  i{
    color: green;
  }
</style>