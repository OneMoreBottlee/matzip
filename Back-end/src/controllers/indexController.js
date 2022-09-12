const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");
const jwt = require("jsonwebtoken");
const secret = require("../../config/secret");
const indexDao = require("../dao/indexDao");

exports.readRestaurants = async function (req, res) {
  const { category } = req.query;

  if(category){
    const validCategory = ["한식", "중식", "일식", "양식", "분식", "구이", "회/초밥", "기타",]
    if(!validCategory.includes(category)){
      return res.send({
        isSuccess: false,
        code: 400, // 요청 실패시 400번대 코드
        message: "유효한 카테고리가 아닙니다",
      });
    }
  }
  
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      try {
        const [rows] = await indexDao.selectRestaurants(connection, category);
  
        return res.send({
          result: rows,
          isSuccess: true,
          code: 200, // 요청 실패시 400번대 코드
          message: "식당 목록 요청 성공",
        });
      } catch (err) {
        logger.error(`readRestaurants Query error\n: ${JSON.stringify(err)}`);
        return false;
      } finally {
        connection.release();
      }
    } catch (err) {
      logger.error(`readRestaurants DB Connection error\n: ${JSON.stringify(err)}`);
      return false;
    }
  };

exports.deleteStudent = async function (req, res) {
  const {studentInx} = req.params;

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const isValidStudentIdx = await indexDao.isValidStudentIdx(connection, studentInx);
      if(!isValidStudentIdx){
        return res.send({
          inSucess: false,
          code: 410,
          message: "유효한 학생 인덱스가 아닙니다.",
        })
      }

      const [rows] = await indexDao.deleteStudent(connection, studentInx);

      return res.send({
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "학생 삭제 성공",
      });
    } catch (err) {
      logger.error(`deleteStudent Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`deleteStudent DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};

exports.updateStudent = async function (req, res) {
  const {studentName, major, birth, adress} = req.body;
  const {studentInx} = req.params;
  
  if( studentName && typeof studentName !== "string") {
    return res.send({
      inSucess: false,
      code: 400,
      message: "값을 정확히 입력해주세요.",
    })
  }

  if( major && typeof major !== "string") {
    return res.send({
      inSucess: false,
      code: 400,
      message: "값을 정확히 입력해주세요.",
    })
  }
  if( adress && typeof adress !== "string") {
    return res.send({
      inSucess: false,
      code: 400,
      message: "값을 정확히 입력해주세요.",
    })
  }

  var regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
  if(birth && !regex.test(birth)){
    return res.send({
      inSucess: false,
      code: 400,
      message: "날짜 형식을 확인해주세요.",
    })
  }
  
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const isValidStudentIdx = await indexDao.isValidStudentIdx(connection, studentInx);
      if(!isValidStudentIdx){
        return res.send({
          inSucess: false,
          code: 410,
          message: "유효한 학생 인덱스가 아닙니다.",
        })
      }

      const [rows] = await indexDao.updateStudents( connection, studentInx, studentName, major, birth, adress);

      return res.send({
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "학생 수정 성공",
      });
    } catch (err) {
      logger.error(`updateStudents Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`updateStudents DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}

exports.createStudent = async function (req, res) {
  const {studentName, major, birth, adress} = req.body;
  
  if(typeof studentName !== "string" ||
    typeof major !== "string" ||
    typeof adress !== "string"){
      return res.send({
        inSucess: false,
        code: 400,
        message: "값을 정확히 입력해주세요.",
      })
    }
  
  var regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
  if(!regex.test(birth)){
    return res.send({
      inSucess: false,
      code: 400,
      message: "날짜 형식을 확인해주세요.",
    })
  }
  
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const [rows] = await indexDao.insertStudents(connection, studentName, major, birth, adress);

      return res.send({
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "학생 생성 성공",
      });
    } catch (err) {
      logger.error(`createStudent Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`createStudent DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}

exports.readStudents = async function(req, res) {
  const {studentInx} = req.params;

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const [rows] = await indexDao.selectStudents(connection, studentInx);

      return res.send({
        result: rows,
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "요청 성공",
      });
    } catch (err) {
      logger.error(`readStudents Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`readStudents DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}

// 예시 코드
exports.example = async function (req, res) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const [rows] = await indexDao.exampleDao(connection);

      return res.send({
        result: rows,
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "요청 성공",
      });
    } catch (err) {
      logger.error(`example Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`example DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};
