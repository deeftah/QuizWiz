<template>
  <section class="table-item flex align-center space-between">
    <div class="player-details flex align-center">
      <div class="player-place">{{idxFormat(id+1)}}</div>
      <div class="player-avatar">
        <img :src="setAvatar(user.nickName)" alt />
      </div>
      <div class="player-name">{{user.nickName}}</div>
    </div>
    <div class="score flex align-center">
      <svg
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <path
            d="M20.4852656,3.5146875 C18.2188125,1.24823438 15.2053594,0 12,0 C8.7946875,0 5.78123438,1.24823438 3.51473437,3.5146875 C1.24823438,5.7811875 0,8.79464062 0,12 C0,15.2053594 1.2481875,18.2188125 3.51473437,20.4853125 C5.78123438,22.7517656 8.7946875,24 12,24 C15.2053594,24 18.2188125,22.7517656 20.4853125,20.4853125 C22.7518125,18.2188125 24,15.2053594 24,12 C24,8.79464063 22.7518125,5.7811875 20.4852656,3.5146875 Z M12.7531875,17.221875 L12.703125,17.221875 L12.703125,18.7781719 C12.703125,19.1664844 12.3883594,19.4812969 12,19.4812969 C11.6117344,19.4812969 11.296875,19.1664844 11.296875,18.7781719 L11.296875,17.221875 L9.74067188,17.221875 C9.35240625,17.221875 9.03754688,16.9070625 9.03754688,16.51875 C9.03754688,16.1304375 9.35240625,15.815625 9.74067188,15.815625 L12.7532344,15.815625 C13.6113281,15.815625 14.3094375,15.1174687 14.3094375,14.259375 C14.3094375,13.4012813 13.6112813,12.703125 12.7531875,12.703125 L11.2468594,12.703125 C9.61335937,12.703125 8.28440625,11.3741719 8.28440625,9.74067187 C8.28440625,8.107125 9.61340625,6.77817187 11.2468594,6.77817187 L11.296875,6.77817187 L11.296875,5.22192187 C11.296875,4.83360937 11.6117344,4.51879687 12,4.51879687 C12.3883594,4.51879687 12.703125,4.83360937 12.703125,5.22192187 L12.703125,6.77817187 L14.2594219,6.77817187 C14.6476875,6.77817187 14.9625469,7.09298437 14.9625469,7.48129687 C14.9625469,7.86960937 14.6476875,8.18442187 14.2594219,8.18442187 L11.2468594,8.18442187 C10.3887188,8.18442187 9.69065625,8.88253125 9.69065625,9.74067187 C9.69065625,10.5987656 10.3887656,11.296875 11.2468594,11.296875 L12.7531875,11.296875 C14.3866875,11.296875 15.7156406,12.625875 15.7156406,14.259375 C15.7156406,15.892875 14.3866875,17.221875 12.7531875,17.221875 Z"
            id="Shape"
            fill="#FFC705"
            fill-rule="nonzero"
          />
        </g>
      </svg>
      <span>&nbsp; {{user.totalScore}}</span>
      <span class="last-score" v-if="lastScore">+{{lastScore}}</span>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      lastScore: null,
      currentQuestion: null
    };
  },
  props: ["user", "users", "id"],
  methods: {
    idxFormat(idx) {
      return idx < 10 ? `0${idx}` : idx;
    },
    setAvatar(nickName) {
      return "https://api.adorable.io/avatars/103/" + nickName + ".png";
    }
  },
  created() {
    this.currentQuestion = this.$store.getters.currentQuestion;
    if (this.user.idx < 1 && this.users > 1) {
      !this.currentQuestion
        ? (this.lastScore = this.user.ans[0].score)
        : (this.lastScore = this.user.ans[
            this.currentQuestion.currentQuestion
          ].score);
    }
  }
};
</script>
