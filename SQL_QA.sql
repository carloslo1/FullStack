CREATE DATABASE BlogDB_QA;
GO

USE BlogDB_QA;
GO

CREATE TABLE Posts (
    PostID INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(255) NOT NULL,
    Content TEXT NOT NULL,
    Author NVARCHAR(100) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL,
    IsDeleted BIT DEFAULT 0
);
GO

CREATE PROCEDURE CreatePost
    @Title NVARCHAR(255),
    @Content TEXT,
    @Author NVARCHAR(100)
AS
BEGIN
    INSERT INTO Posts (Title, Content, Author, CreatedAt)
    VALUES (@Title, @Content, @Author, GETDATE());

    SELECT SCOPE_IDENTITY() AS NewPostID;
END;
GO

CREATE PROCEDURE GetAllPosts
AS
BEGIN
    SELECT * FROM Posts
    WHERE IsDeleted = 0
    ORDER BY CreatedAt DESC;
END;
GO

CREATE PROCEDURE UpdatePostByID
    @PostID INT,
    @Title NVARCHAR(255),
    @Content TEXT,
    @Author NVARCHAR(100)
AS
BEGIN
    UPDATE Posts
    SET Title = @Title,
        Content = @Content,
        Author = @Author,
        UpdatedAt = GETDATE()
    WHERE PostID = @PostID AND IsDeleted = 0;

    SELECT * FROM Posts WHERE PostID = @PostID AND IsDeleted = 0;
END;
GO

CREATE PROCEDURE DeletePostByID
    @PostID INT
AS
BEGIN
    UPDATE Posts
    SET IsDeleted = 1
    WHERE PostID = @PostID;
END;
GO

INSERT INTO Posts (Title, Content, Author)
VALUES 
    ('Getting Started with SQL', 'This is a comprehensive guide on getting started with SQL databases.', 'John Doe'),
    ('Understanding Stored Procedures', 'In this post, we explore the benefits of using stored procedures in SQL.', 'Jane Smith'),
    ('Database Optimization Techniques', 'Learn about techniques to optimize your SQL database performance.', 'Emily Davis');
GO

SELECT * FROM Posts;
GO