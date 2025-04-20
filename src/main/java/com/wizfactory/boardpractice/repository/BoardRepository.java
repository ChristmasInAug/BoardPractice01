package com.wizfactory.boardpractice.repository;

import com.wizfactory.boardpractice.entity.Board;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<Board, Long> {

	
};