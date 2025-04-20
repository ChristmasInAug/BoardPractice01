package com.wizfactory.boardpractice.service.board;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.wizfactory.boardpractice.entity.Board;
import com.wizfactory.boardpractice.repository.BoardRepository;

@Service
public class BoardServiceImpl implements BoardService {
	
	private final BoardRepository boardRepository;
	
	public BoardServiceImpl(BoardRepository boardRepository) {
		this.boardRepository = boardRepository;
	}
	/* Spring Data JPA의 JpaRepository 인터페이스
	 * 
	 *  메서드 이름			설명
		save(entity)	새 엔티티 저장 또는 수정
		findById(id)	ID로 조회
		findAll()	전체 목록 조회
		deleteById(id)	ID로 삭제
	 */
	
	@Override
	public String testService() {
		return "연결 성공";
	}
	@Override
	public List<Board> getBoardList(){
		List<Board> list = boardRepository.findAll();
	    System.out.println("🧩 [Service] boardRepository.findAll() 결과 수: " + list.size());
		return list;
		
	}

	@Override
	public Board getReadBoardById(long id) {
		
		System.out.println("[Service] 전달받은 ID: " + id);
	    Board board = boardRepository.findById(id).orElse(null);
	    System.out.println("[Service] 조회된 Board: " + board);
	    return board;
	}
	
	@Override
	public Board createBoard(Board board) {
		System.out.println("[Service] 저장 된 글 정보 : "+board);
		return boardRepository.save(board);	
	}
	
	@Override
	public Board updateBoard(long id, Board updateBoard) {
		Board existing = boardRepository.findById(id)
		        .orElseThrow(() -> new RuntimeException("해당 게시글이 존재하지 않습니다."));

		    // 수정할 필드만 업데이트
		    existing.setTitle(updateBoard.getTitle());
		    existing.setContent(updateBoard.getContent());
		    existing.setUpdatedAt(LocalDateTime.now());

		    return boardRepository.save(existing);
	}
	@Override
	public boolean deleteBoard(long id) {
	    if (!boardRepository.existsById(id)) {
	        return false;
	    }

	    boardRepository.deleteById(id);
	    return true;
	}
};