<template>
  <Navbar />
  <div class="h-auto min-h-screen bg-base-100 m-10 flex flex-col items-center gap-4">
    <PlayerCardBig
      :playerName="playerName"
      :playerCode="playerCode"
      :playerTeam="playerTeam"
      :playerPrice="playerPrice"
      :teamLogo="teamLogo"
    />
    <div class="flex flex-wrap justify-center gap-4 w-full">
      <div class="stats stats-vertical bg-base-200 rounded-xl w-lg">
        <div class="stat">
          <ul class="divide-y divide-base-200">
            <li 
              v-for="fixture in nextFixtures.slice(0, 10)" 
              :key="fixture.event" 
              class="flex items-center py-3 px-4 hover:bg-base-300 rounded-lg transition">
              <img 
                :src="fixture.opponentLogo" 
                alt="Opponent logo" 
                class="w-8 h-8 mr-3" />
              <div class="flex flex-col">
                <span class="font-semibold">GW {{ fixture.event }}</span>
                <span class="text-sm text-base-content">{{ fixture.opponent }}
                  <span 
                    :class="fixture.is_home ? 'badge badge-success ml-2' : 'badge badge-warning ml-2'">
                    {{ fixture.is_home ? 'Home' : 'Away' }}
                  </span>
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="stats stats-vertical bg-base-200 rounded-xl max-w-sm">
        <div class="stat">
          <table class="table w-full">
            <tbody>
              <tr>
                <td class="font-bold">Position</td>
                <td>{{ playerPosition }}</td>
              </tr>
              <tr>
                <td class="font-bold">Total Points</td>
                <td>{{ playerTotalPoints }}</td>
              </tr>
              <tr>
                <td class="font-bold">Goals Scored</td>
                <td>{{ playerGoalsScored }}</td>
              </tr>
              <tr>
                <td class="font-bold">Assists</td>
                <td>{{ playerAssists }}</td>
              </tr>
              <tr>
                <td class="font-bold">Clean Sheets</td>
                <td>{{ playerCleanSheets }}</td>
              </tr>
              <tr>
                <td class="font-bold">Minutes Played</td>
                <td>{{ playerMinutesPlayed }}</td>
              </tr>
              <tr>
                <td class="font-bold">Form</td>
                <td>{{ playerForm }}</td>
              </tr>
              <tr>
                <td class="font-bold">Selected By</td>
                <td>{{ playerSelectedByPercent }}%</td>
              </tr>
              <tr>
                <td class="font-bold">Transfers In</td>
                <td>{{ playerTransfersInEvent }}</td>
              </tr>
              <tr>
                <td class="font-bold">Transfers Out</td>
                <td>{{ playerTransfersOutEvent }}</td>
              </tr>
              <tr>
                <td class="font-bold">Yellow Cards</td>
                <td>{{ playerYellowCards }}</td>
              </tr>
              <tr>
                <td class="font-bold">Red Cards</td>
                <td>{{ playerRedCards }}</td>
              </tr>
              <tr>
                <td class="font-bold">Bonus Points</td>
                <td>{{ playerBonusPoints }}</td>
              </tr>
              <tr>
                <td class="font-bold">Injury Status</td>
                <td>{{ playerInjuryStatus }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="stats stats-vertical bg-base-200 rounded-xl w-full max-w-lg">
      <div class="stat">
        <select v-model="selectedGameweeks" @change="updateChart" class="select select-bordered w-full max-w-lg mb-3">
          <option value="5">Last 5</option>
          <option value="10">Last 10</option>
          <option value="20">Last 20</option>
          <option value="all">All</option>
        </select>
        <div class="chart-container">
          <canvas id="gameweekPointsChart" class="rounded-lg"></canvas>
        </div>
      </div>
    </div>
    <div class="comments-section bg-base-200 rounded-xl p-4 w-full max-w-lg">
      <h2 class="text-xl font-bold mb-4">Comments</h2>
      <div v-if="user">
        <textarea v-model="newComment" placeholder="Add a comment..." class="textarea textarea-bordered w-full mt-4"></textarea>
        <button @click="submitComment" class="btn btn-primary mt-2" :disabled="isSubmitting">Submit</button>
      </div>
      <div v-else>
        <p class="mt-4">Please <a @click="goToLogin" class="link link-primary">log in</a> to add a comment.</p>
      </div>
      <div v-if="comments.length" class="mt-4">
        <div v-for="comment in comments" :key="comment.id" class="comment mb-4 p-2 bg-base-100 rounded-lg">
          <div class="flex items-center mb-2">
            <img :src="comment.user.avatar_url" alt="User avatar" class="w-8 h-8 rounded-full mr-2" />
            <span class="font-semibold">{{ comment.user.username }}</span>
            <button
              v-if="user && comment.user.id === user.id"
              @click="deleteComment(comment.id)"
              class="btn btn-xs btn-error ml-auto"
            >
              Delete
            </button>
          </div>
          <p>{{ comment.comment }}</p>
          <span class="text-sm text-gray-500">{{ new Date(comment.created_at).toLocaleString() }}</span>
        </div>
      </div>
      <div v-else>
        <p>No comments yet. Be the first to comment!</p>
      </div>
    </div>
  </div>
  <FooterComp />
</template>

<script>
import PlayerCardBig from '@/components/PlayerCardBig.vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  components: {
    PlayerCardBig,
  },
  data() {
    return {
      playerName: "",
      playerCode: "",
      playerTeam: "",
      playerPrice: "",
      playerPosition: "",
      playerTotalPoints: "",
      playerGoalsScored: "",
      playerAssists: "",
      playerCleanSheets: "",
      playerMinutesPlayed: "",
      playerForm: "",
      playerSelectedByPercent: "",
      playerTransfersInEvent: "",
      playerTransfersOutEvent: "",
      playerYellowCards: "",
      playerRedCards: "",
      playerBonusPoints: "",
      playerInjuryStatus: "",
      user: null,
      gameweekPoints: [],
      nextFixtures: [],
      teamLogo: "",
      selectedGameweeks: "10",
      chartInstance: null,
      comments: [],
      newComment: '',
      isSubmitting: false,
    };
  },
  mounted() {
    this.playerName = sessionStorage.getItem("selectedPlayerName") || "Unknown Player";
    this.playerCode = sessionStorage.getItem("selectedPlayerCode") || "";
    this.playerTeam = sessionStorage.getItem("selectedPlayerTeam") || "Unknown Team";
    this.playerPrice = sessionStorage.getItem("selectedPlayerPrice") || "";
    this.playerPosition = sessionStorage.getItem("selectedPlayerPosition") || "Unknown Position";
    this.playerTotalPoints = sessionStorage.getItem("selectedPlayerTotalPoints") || "";
    this.playerGoalsScored = sessionStorage.getItem("selectedPlayerGoalsScored") || "";
    this.playerAssists = sessionStorage.getItem("selectedPlayerAssists") || "";
    this.playerCleanSheets = sessionStorage.getItem("selectedPlayerCleanSheets") || "";
    this.playerMinutesPlayed = sessionStorage.getItem("selectedPlayerMinutesPlayed") || "";
    this.playerForm = sessionStorage.getItem("selectedPlayerForm") || "";
    this.playerSelectedByPercent = sessionStorage.getItem("selectedPlayerSelectedByPercent") || "";
    this.playerTransfersInEvent = sessionStorage.getItem("selectedPlayerTransfersInEvent") || "";
    this.playerTransfersOutEvent = sessionStorage.getItem("selectedPlayerTransfersOutEvent") || "";
    this.playerYellowCards = sessionStorage.getItem("selectedPlayerYellowCards") || "";
    this.playerRedCards = sessionStorage.getItem("selectedPlayerRedCards") || "";
    this.playerBonusPoints = sessionStorage.getItem("selectedPlayerBonusPoints") || "";
    this.playerInjuryStatus = sessionStorage.getItem("selectedPlayerInjuryStatus") || "";
    this.user = useSupabaseUser().value;
    this.gameweekPoints = JSON.parse(sessionStorage.getItem("selectedPlayerGameweekPoints")) || [];
    this.nextFixtures = JSON.parse(sessionStorage.getItem("selectedPlayerNextFixtures")) || [];
    this.teamLogo = sessionStorage.getItem("selectedPlayerTeamLogo") || "";
    this.renderChart();
    this.fetchComments();
  },
  methods: {
    getPlayerImage(playerCode) {
      return playerCode ? `https://resources.premierleague.com/premierleague/photos/players/110x140/p${playerCode}.png` : '';
    },
    renderChart() {
      const ctx = document.getElementById('gameweekPointsChart').getContext('2d');
      let gameweeksToShow;
      if (this.selectedGameweeks === "all") {
        gameweeksToShow = this.gameweekPoints;
      } else {
        gameweeksToShow = this.gameweekPoints.slice(-this.selectedGameweeks);
      }
      this.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: gameweeksToShow.map(point => `GW ${point.gameweek}`),
          datasets: [{
            label: 'Gameweek points',
            data: gameweeksToShow.map(point => point.points),
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1.5,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    },
    updateChart() {
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      this.renderChart();
    },
    async fetchComments() {
      try {
        const response = await fetch(`/api/comments?player_id=${this.$route.params.id}`);
        this.comments = await response.json();
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },
    async submitComment() {
      if (!this.newComment.trim()) return;

      this.isSubmitting = true;
      try {
        const response = await fetch('/api/add-comment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            player_id: this.$route.params.id,
            user_id: this.user.id,
            comment: this.newComment,
          }),
        });
        const result = await response.json();
        if (result.success) {
          await this.fetchComments();
          this.newComment = '';
        } else {
          console.error('Error adding comment:', result.error);
        }
      } catch (error) {
        console.error('Error adding comment:', error);
      } finally {
        this.isSubmitting = false;
      }
    },
    async deleteComment(commentId) {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(
        `/api/delete-comment?comment_id=${commentId}&user_id=${this.user.id}`,
        { method: 'DELETE' }
      );
      const result = await response.json();
      if (result.success) {
        this.comments = this.comments.filter(comment => comment.id !== commentId);
      } else {
        console.error('Error deleting comment:', result.error);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  },
    goToLogin() {
      this.$router.push('/login');
    },
  },
};
</script>