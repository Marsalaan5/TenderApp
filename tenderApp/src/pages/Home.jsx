import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchTenders } from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
// import { io } from 'socket.io-client';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
} from 'react-bootstrap';
import TenderSearchBar from './TenderSearchBar';
import { FaFilter, FaRegCalendarAlt } from 'react-icons/fa';

// const socket = io('http://localhost:5000');

function Home() {
  const [tenders, setTenders] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    state: '',
    sector: '',
    deadlineBefore: '',
  });

  useEffect(() => {
    loadTenders(true);
    // eslint-disable-next-line
  }, [filters]);

//   useEffect(() => {
//     socket.on('newTender', (tender) => {
//       toast.info(`New tender added: ${tender.title}`);
//       setTenders((prev) => [tender, ...prev]);
//     });

//     return () => socket.off('newTender');
//   }, []);

const transformTender = (t) => ({
  _id: t.id || t.tid,          
  tid: t.tid || '',
  title: t.brief || "No title",
  description: t.brief || "No description",
  state: t.location || "Unknown",
  sector: t.organization || "Unknown",
  deadline: t.due_date || null,
  value: t.value || '',
  emd: t.emd || '',
  link: t.link || '',
});

const loadTenders = async (reset = false) => {
  const nextPage = reset ? 1 : page;
  try {
    const response = await fetchTenders({
      ...filters,
      page: nextPage,
      limit: 10,
    });

    // Map backend data to React component expected shape
    const transformedData = response.data.map(transformTender);

    if (reset) {
      setTenders(transformedData);
      setPage(2);
    } else {
      setTenders((prev) => [...prev, ...transformedData]);
      setPage(nextPage + 1);
    }
    if (response.data.length < 10) setHasMore(false);
    else setHasMore(true);
  } catch (err) {
    toast.error("Failed to load tenders");
  }
};


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    loadTenders(true);
  };

  const handleNormalSearch = (query) => {
    console.log('Normal Search for:', query);
  };

  const handleAISearch = (query) => {
    console.log('AI Search for:', query);
  };

  return (
    <Container className="my-5">
      {/* Hero / Search Section */}
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold">Explore Latest Tenders</h1>
        <p className="text-muted">Find tenders by state, sector, and deadline. Try AI-powered search for smarter results.</p>
      </div>

      <TenderSearchBar onSearch={handleNormalSearch} onAISearch={handleAISearch} />

      {/* Filter Section */}
      <Form onSubmit={applyFilters} className="mb-4 bg-light p-3 rounded shadow-sm">
        <Row className="align-items-end">
          <Col md={4}>
            <Form.Label>State</Form.Label>
            <Form.Control
              placeholder="Enter state"
              name="state"
              value={filters.state}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={4}>
            <Form.Label>Sector</Form.Label>
            <Form.Control
              placeholder="Enter sector"
              name="sector"
              value={filters.sector}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={3}>
            <Form.Label>
              <FaRegCalendarAlt className="me-1" />
              Deadline Before
            </Form.Label>
            <Form.Control
              type="date"
              name="deadlineBefore"
              value={filters.deadlineBefore}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={1}>
            <Button variant="primary" type="submit" className="w-100">
              <FaFilter />
            </Button>
          </Col>
        </Row>
      </Form>

 
      <InfiniteScroll
        dataLength={tenders.length}
        next={() => loadTenders(false)}
        hasMore={hasMore}
        loader={<h5>Loading...</h5>}
        endMessage={<p className="text-center text-muted">No more tenders</p>}
      >
       <Row className="justify-content-center mt-5">
  {tenders.map((t) => (
    <Col md={8} key={t._id} className="mb-4">
      <Card className="shadow-sm border-0">
        {/* <Card.Body>
          <Card.Subtitle className="mb-2 text-muted small">
            📍 {t.state} | 🏢 {t.sector}
          </Card.Subtitle>
          <Card.Title className="text-secondary fw-bold">{t.title}</Card.Title>
          <div className="mt-2">
            💰 <strong>Value:</strong> {t.value || 'N/A'} <br />
            🏦 <strong>EMD:</strong> {t.emd || 'N/A'}
          </div>
        </Card.Body> */}
        <Card.Body>
  <Card.Subtitle className="mb-2 text-muted small">
    📍 {t.state} | 🏢 {t.sector}
  </Card.Subtitle>

  <Card.Title className="text-secondary fw-bold">
    <a href={t.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
      {t.title}
    </a>
  </Card.Title>

  <div className="mt-2">
    💰 <strong>Value:</strong> {t.value || 'N/A'} <br />
    🏦 <strong>EMD:</strong> {t.emd || 'N/A'} <br />
    🔑 <strong>TID:</strong> {t.tid || 'N/A'} <br />
    🆔 <strong>ID:</strong> {t._id || 'N/A'} <br />
    🔗 <strong>Link:</strong> <a href={t.link} target="_blank" rel="noopener noreferrer">Open Tender</a>
  </div>
</Card.Body>

        <Card.Footer className="text-end small text-muted">
          ⏳ Deadline: {t.deadline ? new Date(t.deadline).toLocaleDateString() : 'N/A'}
        </Card.Footer>
      </Card>
    </Col>
  ))}
</Row>

      </InfiniteScroll>
    </Container>
  );
}

export default Home;



// import React, { useEffect, useState } from 'react';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import { FaFilter, FaRegCalendarAlt } from 'react-icons/fa';
// import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

// const Home = () => {
//   const [tenders, setTenders] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [filters, setFilters] = useState({
//     state: '',
//     sector: '',
//     deadlineBefore: '',
//   });

//   useEffect(() => {
//     loadTenders(true);
//   }, [filters]);

//   const loadTenders = async (reset = false) => {
//     const nextPage = reset ? 1 : page;
//     try {
//       const response = await axios.get('http://localhost:5000/api/tenders', {
//         params: {
//           ...filters,
//           page: nextPage,
//           limit: 10,
//         }
//       });
//       if (reset) {
//         setTenders(response.data);
//         setPage(2);
//       } else {
//         setTenders((prev) => [...prev, ...response.data]);
//         setPage(nextPage + 1);
//       }
//       if (response.data.length < 10) setHasMore(false);
//       else setHasMore(true);
//     } catch (err) {
//       toast.error('Failed to load tenders');
//     }
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   const applyFilters = (e) => {
//     e.preventDefault();
//     loadTenders(true);  // Load tenders from page 1
//   };

//   return (
//     <Container className="my-5">
//       {/* Hero / Search Section */}
//       <div className="text-center mb-5">
//         <h1 className="display-5 fw-bold">Explore Latest Tenders</h1>
//         <p className="text-muted">
//           Find tenders by state, sector, and deadline. Try AI-powered search for smarter results.
//         </p>
//       </div>

//       {/* Filter Section */}
//       <Form onSubmit={applyFilters} className="mb-4 bg-light p-3 rounded shadow-sm">
//         <Row className="align-items-end">
//           <Col md={4}>
//             <Form.Label>State</Form.Label>
//             <Form.Control
//               placeholder="Enter state"
//               name="state"
//               value={filters.state}
//               onChange={handleFilterChange}
//             />
//           </Col>
//           <Col md={4}>
//             <Form.Label>Sector</Form.Label>
//             <Form.Control
//               placeholder="Enter sector"
//               name="sector"
//               value={filters.sector}
//               onChange={handleFilterChange}
//             />
//           </Col>
//           <Col md={3}>
//             <Form.Label>
//               <FaRegCalendarAlt className="me-1" />
//               Deadline Before
//             </Form.Label>
//             <Form.Control
//               type="date"
//               name="deadlineBefore"
//               value={filters.deadlineBefore}
//               onChange={handleFilterChange}
//             />
//           </Col>
//           <Col md={1}>
//             <Button variant="primary" type="submit" className="w-100">
//               <FaFilter />
//             </Button>
//           </Col>
//         </Row>
//       </Form>

//       {/* Tender Cards */}
//       <InfiniteScroll
//         dataLength={tenders.length}
//         next={() => loadTenders(false)}
//         hasMore={hasMore}
//         loader={<h5>Loading...</h5>}
//         endMessage={<p className="text-center text-muted">No more tenders</p>}
//       >
//         <Row>
//           {tenders.map((tender) => (
//             <Col md={4} key={tender.id} className="mb-4">
//               <Card className="h-100 shadow-sm border-0">
//                 <Card.Body>
//                   <Card.Title className="text-primary fw-bold">{tender.title}</Card.Title>
//                   <Card.Subtitle className="mb-2 text-muted small">
//                     📍 {tender.state} | 🏢 {tender.sector}
//                   </Card.Subtitle>
//                   <Card.Text>{tender.description}</Card.Text>
//                 </Card.Body>
//                 <Card.Footer className="text-end small text-muted">
//                   ⏳ Deadline: {new Date(tender.due_date).toLocaleDateString()}
//                 </Card.Footer>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       </InfiniteScroll>

//       <ToastContainer />
//     </Container>
//   );
// };

// export default Home;
