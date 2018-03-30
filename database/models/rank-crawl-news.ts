const database = require('../index'),
  sequelize = database.sequelize,
  Sequelize = database.Sequelize;

export let model = sequelize.define('rank_crawl_news', {
  idx: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  keyword: {
    type: Sequelize.STRING,
  },
  url: {
    type: Sequelize.STRING,
  },
  title: {
    type: Sequelize.STRING,
  },
  content: {
    type: Sequelize.STRING
  },
  press : {
    type: Sequelize.STRING
  },
  rank_crawl_idx: {
    type: Sequelize.INTEGER,
    references: {
      model: 'rank_crawl_logs',
      key: 'idx',
    },
    onDelete: 'CASCADE',
  },
}, {
  timestamps: true,
  deletedAt: false,
});
