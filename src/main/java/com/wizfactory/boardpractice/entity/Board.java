package com.wizfactory.boardpractice.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;    // JPA관련 어노테이션 제공(entity, table, id, colum, generatedvalue)
import lombok.*;

@Entity
@Table(name = "boardpost")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Board {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

	@Column(name = "title")
	private String title;
	
	@Column(name = "content", columnDefinition = "TEXT")
	private String content;
	
	@Column(name = "writer")
	private String writer;
	
	
    public Long getId() {
    	return this.id;
    }
	public String getTitle() {
		return this.title;
	}
	public String getContent() {
		return this.content;
	}
	public String getWriter() {
		return this.writer;
	}
	
	public void setTitle(String title) {
	    this.title = title;
	}

	public void setContent(String content) {
	    this.content = content;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
	    this.updatedAt = updatedAt;
	}
	
	
	
    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "view_count")
    private int viewCount;
    
    public int getViewCount() {
    	return this.viewCount;
    }
    public void setViewCount(int viewCount) {
        this.viewCount = viewCount;
    }
    public LocalDateTime getCreatedAt() {
    	return this.createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
    	return this.updatedAt;
    }

	
};
