package com.ssafy.yourstar.domain.meeting.controller;

import com.ssafy.yourstar.domain.meeting.db.entity.Meeting;
import com.ssafy.yourstar.domain.meeting.request.MeetingApplyByStarPostReq;
import com.ssafy.yourstar.domain.meeting.service.MeetingService;
import com.ssafy.yourstar.global.model.response.BaseResponseBody;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartHttpServletRequest;

@Api("미팅룸 관계자 관련 API")
@Slf4j
@RestController
@RequestMapping("/api/meetings")
public class RoomApplicantController {
    @Autowired
    MeetingService meetingService;

    @ApiOperation(value = "스타가 팬미팅 신청")
    @PostMapping(value = "/room-applicant", consumes= {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE} )
    public ResponseEntity<? extends BaseResponseBody> meetingApplyByStar
            (@RequestPart(value = "meetingApply") MeetingApplyByStarPostReq meetingApplyByStarPostReq, MultipartHttpServletRequest request) {
        log.info("meetingApplyByStar - Call");
        log.info(meetingApplyByStarPostReq.toString());

        meetingService.meetingApplyByStar(meetingApplyByStarPostReq, request);
        return ResponseEntity.status(201).body(BaseResponseBody.of(201, "Success"));
    }

    @ApiOperation(value = "스타가 팬미팅 수정")
    @PutMapping(value = "/room-applicant", consumes= {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<? extends BaseResponseBody> meetingModifyByStar
            (@RequestPart(value = "meetingModify") Meeting meeting, MultipartHttpServletRequest request) {
        log.info("meetingModifyByStar - Call");

        meetingService.meetingModifyByStar(meeting, request);

        return ResponseEntity.status(201).body(BaseResponseBody.of(201, "Success"));
    }

    @ApiOperation(value = "스타가 신청한 팬미팅 취소")
    @DeleteMapping("/room-applicant/{meetingId}")
    public ResponseEntity<? extends BaseResponseBody> meetingRemoveByStar
            (@ApiParam(value = "팬미팅 번호") @PathVariable("meetingId") int meetingId) {
        log.info("meetingRemoveByStar - Call");

        if (meetingService.meetingRemoveByStar(meetingId)) {
            return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
        } else {
            log.error("meetingRemoveByStar - This MeetingId doesn't exist");
            return ResponseEntity.status(400).body(BaseResponseBody.of(400, "This MeetingId doesn't exist"));
        }
    }
}
