package com.wizfactory.boardpractice.service.board;

import java.util.List;

import com.wizfactory.boardpractice.entity.Board;

public interface BoardService {
	String testService();
	List<Board>getBoardList();
	Board getReadBoardById(long id);
	Board createBoard(Board board);
	Board updateBoard(long id, Board updateBoard);
	boolean deleteBoard(long id);

	
}