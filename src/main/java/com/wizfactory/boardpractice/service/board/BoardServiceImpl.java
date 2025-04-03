package com.wizfactory.boardpractice.service.board;

import org.springframework.stereotype.Service;

@Service
public class BoardServiceImpl implements BoardService {
	
	@Override
	public String testService() {
		return "연결 성공";
	}
};