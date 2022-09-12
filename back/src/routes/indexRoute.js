module.exports = function (app) {
  const index = require("../controllers/indexController");
  const jwtMiddleware = require("../../config/jwtMiddleware");

  // app.get("/students/:studentInx", index.readStudents)
  // app.post("/students", index.createStudent)
  // app.patch("/students/:studentInx", index.updateStudent)
  // app.delete("/students/:studentInx", index.deleteStudent)

  // 식당 목록 조회
  app.get("/restaurants", index.readRestaurants);
};
