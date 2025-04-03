package com.wizfactory.boardpractice.web.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
	
}