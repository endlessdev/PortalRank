'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        /*
         Add altering commands here.
         Return a promise to correctly handle asynchronicity.

         Example:
         return queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */

        return queryInterface.createTable('rank_crawl_news', {
            idx: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            rank_crawl_idx: {
                type: Sequelize.INTEGER,
                references: {
                    model: "rank_crawl_logs",
                    key: "idx"
                },
                onDelete: "CASCADE"
            },
            keyword: {
                type: Sequelize.STRING,
            },
            url: {
                type: Sequelize.STRING,
                unique: true
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                type: Sequelize.DATE(),
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()'),
            }
        }, {
            timestamps: true,
        })
    },

    down: function (queryInterface, Sequelize) {
        /*
         Add reverting commands here.
         Return a promise to correctly handle asynchronicity.

         Example:
         return queryInterface.dropTable('users');
         */
        return queryInterface.dropTable('rank_crawl_news');
    }
};
