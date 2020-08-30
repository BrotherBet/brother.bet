export default class Main {
  constructor({
    window,
    tf,
    firebase,
    Typed,
    $,
    Environment,
    Api,
    Database,
    FactoryUtil,
    LocalDB,
    Fifa,
    DashTables,
    DashStatistics,
    DashTimelines,
    Dashboard,
    tableRanking,
    statistics,
    timeline,
    tableLastGames,
  }) {
    // Constants
    this.firebaseConfig = {
      apiKey: 'AIzaSyCkYehF5D_TWlTEDNnbHNJt0EVKqLO9NUo',
      authDomain: 'brother-bet.firebaseapp.com',
      databaseURL: 'https://brother-bet.firebaseio.com',
      projectId: 'brother-bet',
      storageBucket: 'brother-bet.appspot.com',
      messagingSenderId: '1004176095521',
      appId: '1:1004176095521:web:5e0d2d7f43d7140a5ee660',
      measurementId: 'G-JP3CLKKFHR',
    };

    // Variables
    this.origin = '';

    // Static Components;
    this.tableRanking = tableRanking;
    this.statistics = statistics;
    this.timeline = timeline;
    this.tableLastGames = tableLastGames;

    // Objects
    this.window = window;
    this.tf = tf;
    this.firebase = firebase;
    this.Typed = Typed;
    this.$ = $;
    this.Environment = Environment;
    this.Api = Api;
    this.Database = Database;
    this.FactoryUtil = FactoryUtil;
    this.LocalDB = LocalDB;
    this.Fifa = Fifa;
    this.DashTables = DashTables;
    this.DashStatistics = DashStatistics;
    this.DashTimelines = DashTimelines;
    this.Dashboard = Dashboard;

    // Globals
    this.window.developerMode = { status: false };
    this.window.passedSeconds = { value: 0 };
    this.window.initTime = { value: 0 };
    this.indexedDb = {};
    this.localStorage = {};

    // Initialize
    this.layout = this.init();
  }

  init() {
    const { indexedDB, localStorage, origin } = this.window;
    const { newOrigin, developerMode } = new this.Environment(origin);
    const { api } = new this.Api(newOrigin);
    const {
      hash,
      generateDaysOfYear,
      delay,
      filterRankByTarget,
      getRegisteredDays,
      debugTime,
    } = this.FactoryUtil;
    const database = new this.Database(api, delay);
    const localDB = new this.LocalDB({
      hash,
      indexedDB,
      localStorage,
    });
    const fifa = new this.Fifa({
      developerMode,
      tf: this.tf,
      localDB,
      database,
      debugTime,
      hash,
    });
    const dashTables = new this.DashTables({
      $: this.$,
      hash,
      generateDaysOfYear,
      getRegisteredDays,
      tableRanking: this.tableRanking,
      tableLastGames: this.tableLastGames,
    });
    const dashStatistics = new this.DashStatistics({
      $: this.$,
      developerMode,
      statistics: this.statistics,
    });
    const dashboard = new this.Dashboard({
      Typed: this.Typed,
      $: this.$,
      developerMode,
      debugTime,
      filterRankByTarget,
      hash,
      localDB,
      fifa,
      dashTables,
      dashStatistics,
      DashTimelines: this.DashTimelines,
      timeline: this.timeline,
    });

    this.window.developerMode.status = developerMode;

    this.firebase.initializeApp(this.firebaseConfig);
    if (!developerMode) this.firebase.analytics();

    return dashboard;
  }
}
