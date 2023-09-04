'use strict';
const { Partners } = require('../models'); // Import your Partners model

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await Partners.bulkCreate([
      // { username: 'user1', email: 'user1@example.com' },
      // { username: 'user2', email: 'user2@example.com' },
    // {
    //   name:'',
    //   logo_url:'',
    //   phone:'',
    //   email:'',
    //   website:'',
    //   about:'',
    //   position:{lat:0,lng:0},
    //   region_id:0,
    // },
    {
      name:'ahmed',
      logo_url:'image-1692544048084.jpg',
      phone:54080844,
      email:'aaa@aaaa.aaaa',
      website:'',
      about:'test hera and write what ever u want',
      position:{lat:0,lng:0},
      region_id:2,
      state:1,
    },
    {
      name:'samar',
      logo_url:'image-1692544687877.jpg',
      phone:54054844,
      email:'aaa@aaaa.aaaa',
      website:'',
      about:'test hera and write what ever u want',
      position:{lat:0,lng:0},
      region_id:1,
      state:1,
    },
    {
      name:'oussama',
      logo_url:'image-1692544723810.jpg',
      phone:54054844,
      email:'aaa@aaaa.aaaa',
      website:'',
      about:'test hera and write what ever u want',
      position:{lat:0,lng:0},
      region_id:1,
      state:1,
    },
    {
      name:'olfa',
      logo_url:'image-1692545110438.jpg',
      phone:54054844,
      email:'aaa@aaaa.aaaa',
      website:'',
      about:'test hera and write what ever u want',
      position:{lat:0,lng:0},
      region_id:3,
      state:1,
    },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    
  }
};
