const express = require("express");
const router = express.Router();
const workSpaceController = require("../controller/workSpaces");
const authMiddleware = require("../middlewares/auth-middleware");
const isMember = require("../middlewares/isMember");


//워크스페이스 생성
router.post("/workSpace/create", authMiddleware, workSpaceController.create);

//워크스페이스 멤버 추가
router.put("/workSpace/memberAdd/:workSpaceName", authMiddleware,isMember, workSpaceController.memberAdd);

//룸 이름 얻기
router.get("/workSpace/getRoomName/:workSpaceName/:opponent", authMiddleware, isMember, workSpaceController.roomName);

//멤버 목록 조회
router.get("/workSpace/MemberList/:workSpaceName", authMiddleware, isMember, workSpaceController.getMemberList);

//멤버 삭제
router.put("/workSpace/deleteMember/:workSpaceName", authMiddleware, isMember, workSpaceController.deleteMember);

module.exports = router;
