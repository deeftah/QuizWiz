<template>
  <section class>
    <component :is="gameStage" :info="cmp.info" :currQuest="currQuest" :gameRes="cmp.gameRes" />
  </section>
</template>

<script>
//the Dynamic game screens
import quizDetails from "../components/quizGameScreens/quizDetails";
import quizEnd from "../components/quizGameScreens/quizEnd";
import quizLobby from "../components/quizGameScreens/quizLobby";
import quizResult from "../components/quizGameScreens/quizResult";
import quizQuest from "../components/quizGameScreens/quizQuest";

//Event bus
import eventBus, { GAME_ON } from "@/event-bus.js";

export default {
  name: "quizGame",
  data() {
    return {
      cmp: {
        type: "quizDetails",
        info: {
          quiz: Object,
          currQuest: Number,
          timer: Number
        }
      },
      user: {}
    };
  },
  components: {
    quizDetails,
    quizEnd,
    quizLobby,
    quizResult,
    quizQuest
  },
  computed: {
    gameStage() {
      return this.$store.getters.gameStage;
    },

    currQuest() {
      return this.$store.getters.currentQuestion;
    }
  },
  watch: {
    "$store.getters.currentQuestion": function(newVal, oldVal) {
      this.cmp.info.currQuest = newVal.currentQuestion;
    }
  },

  async created() {
    const quizId = this.$route.params.id;
    var quiz = await this.$store.dispatch({ type: "getQuiz", quizId });
    this.cmp.info = { quiz, currQuest: 0, timer: null };
    this.cmp.testInfo;

    //Event bus which Remove footer and header
    eventBus.$emit(GAME_ON);
  }
};
</script>

<style lang="scss">
</style>