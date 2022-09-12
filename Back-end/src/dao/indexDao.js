const { pool } = require("../../config/database");

exports.selectRestaurants = async function (connection, category) {
  const selectAllRestaurantsQuery = `SELECT title, address, category, videoUrl FROM Restaurants where status = 'A';`;
  const selectCategoryRestaurantsQuery = `SELECT title, address, category, videoUrl FROM Restaurants where status = 'A' and category = ?;`;
  const Params = [category];

  const Query = category ? selectCategoryRestaurantsQuery : selectAllRestaurantsQuery;

  const rows = await connection.query(Query, Params);

  return rows;
};

exports.deleteStudent = async function (connection, studentInx) {
  const Query = `update Students set status = "D" where studentInx = ?;`;
  const Params = [studentInx];
  const rows = await connection.query(Query, Params);

  return rows;
};

exports.updateStudents = async function(connection, studentInx, studentName, major, birth, adress){
  const Query = `update Students set studentName = ifnull(?, studentName), major = ifnull(?, major), birth = ifnull(?, birth), adress = ifnull(?, adress) where studentInx = ?;`;
  const Params = [studentName, major, birth, adress, studentInx];
  const rows = await connection.query(Query, Params);

  return rows;
}

exports.isValidStudentIdx = async function (connection, studentInx) {
  const Query = `SELECT * FROM Students where studentInx = ? and status = 'A';`;
  const Params = [studentInx];
  const rows = await connection.query(Query, Params);

  if(rows < 1){
    return false;
  }

  return true;
};

exports.insertStudents = async function (connection, studentName, major, birth, adress) {
  const Query = `insert into Students(studentName, major, birth, adress) values (?,?,?,?);`;
  const Params = [studentName, major, birth, adress];
  const rows = await connection.query(Query, Params);
  return rows;
};

exports.selectStudents = async function (connection, studentInx) {
  const Query = `SELECT * FROM Students where studentInx = ?`;
  const Params = [studentInx];

  const rows = await connection.query(Query, Params);
  return rows;
};

exports.exampleDao = async function (connection) {
  const Query = `SELECT * FROM Students`;
  const Params = [];

  const rows = await connection.query(Query, Params);

  return rows;
};
