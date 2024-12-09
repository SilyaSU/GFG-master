import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Button, Modal, Spin } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import axios from 'axios';

type Book = {
  book_id: number;
  book_title: string;
  author: string;
  genre: string;
};

type Review = {
  review: string;
  login: string;
};

type Discussion = {
  message: string;
  login: string;
};

const Home: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);
  const [loadingDiscussions, setLoadingDiscussions] = useState<boolean>(false);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState<boolean>(false);
  const [isDiscussionsModalOpen, setIsDiscussionsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get('http://localhost:3001/books')
      .then((response) => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
        setLoading(false);
      });
  }, []);

  const loadReviews = (bookId: number) => {
    setLoadingReviews(true);
    axios
      .get(`http://localhost:3001/books/${bookId}/reviews`)
      .then((response) => {
        setReviews(response.data);
        setLoadingReviews(false);
      })
      .catch((error) => {
        console.error('Error fetching reviews:', error);
        setLoadingReviews(false);
      });
  };

  const loadDiscussions = (bookId: number) => {
    setLoadingDiscussions(true);
    axios
      .get(`http://localhost:3001/books/${bookId}/discussions`)
      .then((response) => {
        setDiscussions(response.data);
        setLoadingDiscussions(false);
      })
      .catch((error) => {
        console.error('Error fetching discussions:', error);
        setLoadingDiscussions(false);
      });
  };

  const handleViewReviews = (bookId: number) => {
    setSelectedBookId(bookId);
    loadReviews(bookId);
    setIsReviewsModalOpen(true);
  };

  const handleViewDiscussions = (bookId: number) => {
    setSelectedBookId(bookId);
    loadDiscussions(bookId);
    setIsDiscussionsModalOpen(true);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1600px', margin: '0 auto' }}>
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '20%' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <h1 style={{ textAlign: 'center', marginBottom: '40px', color: '#555' }}>Библиотечный форум</h1>
          <Row gutter={[24, 24]}>
            {books.map((book) => (
              <Col key={book.book_id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  title={book.book_title}
                  extra={
                    <div>
                      <Button
                        type="primary"
                        onClick={() => handleViewReviews(book.book_id)}
                        style={{ marginRight: '8px' }}
                        size="small"
                      >
                        Рецензии
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => handleViewDiscussions(book.book_id)}
                        size="small"
                      >
                        Обсуждения
                      </Button>
                    </div>
                  }
                  hoverable
                  style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                >
                  <p>
                    <strong>Автор:</strong> {book.author}
                  </p>
                  <p>
                    <strong>Жанр:</strong> {book.genre}
                  </p>
                </Card>
              </Col>
            ))}
          </Row>

          <Modal
            title="Рецензии"
            open={isReviewsModalOpen}
            onCancel={() => setIsReviewsModalOpen(false)}
            footer={null}
            bodyStyle={{ padding: '20px' }}
          >
            {loadingReviews ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin size="large" />
              </div>
            ) : (
              <>
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                      <p>
                        <strong>{review.login}</strong>: {review.review}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>Рецензий пока нет.</p>
                )}
              </>
            )}
          </Modal>

          <Modal
            title="Обсуждения"
            open={isDiscussionsModalOpen}
            onCancel={() => setIsDiscussionsModalOpen(false)}
            footer={null}
            bodyStyle={{ padding: '20px' }}
          >
            {loadingDiscussions ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin size="large" />
              </div>
            ) : (
              <>
                {discussions.length > 0 ? (
                  discussions.map((discussion, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                      <p>
                        <strong>{discussion.login}</strong>: {discussion.message}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>Обсуждений пока нет.</p>
                )}
              </>
            )}
          </Modal>
        </>
      )}
    </div>
  );
};

export default Home;
