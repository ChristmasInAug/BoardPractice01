package com.wizfactory.boardpractice.web.controller;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.wizfactory.boardpractice.entity.Board;
import com.wizfactory.boardpractice.service.board.BoardService;

@RestController
@RequestMapping("/api")
public class BoardController {
	
	private final BoardService boardService;
	
	public BoardController(BoardService boardService) {
		this.boardService = boardService;
	}
	
	@GetMapping("/test")
	public String testConnection() {
		return boardService.testService();
	}
	
	@ResponseBody
	@GetMapping("/boardlist")
	public List<Board> getBoardList(){
		 List<Board> list = boardService.getBoardList();
		 System.out.println("🚀 [Controller] Service에서 받은 게시글 수: " + list.size());
		return boardService.getBoardList();
	}
	
	@GetMapping("/board/{id}")
	public Board getReadBoardById(@PathVariable("id") long id) {
		/* 기존 public Board getReadBoardById(@PathVariable long id) -> 계속 조회가 되지 않음. 모든 데이터가 빈칸으로 조회 됨.
		 * ("/board/{id}")에서 id가 가르키는 것이 무엇인지 알수 없어서 계속 에러 떴었음*/
		System.out.println("[Controller] 전달받은 ID: " + id);
	    Board result = boardService.getReadBoardById(id);
	    System.out.println("[Controller] 서비스로부터 받은 결과: " + result);
	    return result;	}
	
	@PostMapping("/post")
	public Board createBoard(@RequestBody Board board) {
		System.out.println("[Controller] 받은 글 정보 : "+ board);
		return boardService.createBoard(board);
	}
	
	@PutMapping("/update/{id}")
	public ResponseEntity<Board> updateBoard(@PathVariable("id") long id, @RequestBody Board updateBoard){
		Board board = boardService.updateBoard(id, updateBoard);
		return ResponseEntity.ok(board);
	}
	
	@DeleteMapping("delete/{id}")
	public ResponseEntity<String> deleteBoard(@PathVariable("id") long id) {
	    boolean deleted = boardService.deleteBoard(id);  // boolean으로 결과 판단

	    if (deleted) {
	        return ResponseEntity.ok("삭제 완료!");
	    } else {
	        return ResponseEntity.status(404).body("해당 게시글이 없습니다.");
	    }
	}
	
	@PutMapping("/board/viewcount/{id}")
	public ResponseEntity<Void> updateViewCount(@PathVariable("id") long id) {
	    boardService.increaseViewCount(id);
	    return ResponseEntity.ok().build(); // 내용 없이 200 OK
	} 
	
}