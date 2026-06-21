import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { TrendingUp, User, Mail, Lock } from "lucide-react";
import { request } from "../services/httpClient";
import { Link } from "react-router-dom"; // Importação do componente de link nativo

export const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      await request("/auth/register", "POST", { name, email, password });
      setSuccess(true);
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Erro ao realizar o cadastro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center bg-black" style={{ minHeight: "100vh" }} fluid>
      <Row className="w-100 justify-content-center">
        <Col xs={11} sm={8} md={5} lg={4} xl={3}>
          
          {/* Cabeçalho Minimalista */}
          <div className="text-center mb-5">
            <div className="text-white mb-2 d-flex align-items-center justify-content-center gap-2">
              <TrendingUp size={24} strokeWidth={2.5} />
              <h3 className="fw-bold m-0 tracking-tight" style={{ letterSpacing: "-0.5px" }}>Criar Conta</h3>
            </div>
            <p className="text-muted small">Preencha os campos para iniciar sua carteira</p>
          </div>

          {/* Alertas  */}
          {error && (
            <Alert variant="dark" className="py-2 text-center border-danger text-danger bg-transparent small mb-4">
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="dark" className="py-2 text-center border-success text-success bg-transparent small mb-4">
              Conta criada com sucesso!{" "}
              <Link to="/login" className="text-white text-decoration-underline fw-medium">
                Faça login aqui.
              </Link>
            </Alert>
          )}

          {/* Formulário */}
          <Form onSubmit={handleSubmit}>
            
            {/* Campo de Nome */}
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label className="text-muted small d-flex align-items-center gap-2 mb-1">
                <User size={14} /> Nome Completo
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-dark text-white border-secondary border-opacity-25 py-2 px-3 shadow-none custom-input"
                style={{ fontSize: "14px", backgroundColor: "#121212" }}
              />
            </Form.Group>

            {/* Campo de E-mail */}
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label className="text-muted small d-flex align-items-center gap-2 mb-1">
                <Mail size={14} /> E-mail
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="nome@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-dark text-white border-secondary border-opacity-25 py-2 px-3 shadow-none custom-input"
                style={{ fontSize: "14px", backgroundColor: "#121212" }}
              />
            </Form.Group>

            {/* Campo de Senha */}
            <Form.Group className="mb-4" controlId="formPassword">
              <Form.Label className="text-muted small d-flex align-items-center gap-2 mb-1">
                <Lock size={14} /> Senha
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-dark text-white border-secondary border-opacity-25 py-2 px-3 shadow-none custom-input"
                style={{ fontSize: "14px", backgroundColor: "#121212" }}
              />
            </Form.Group>

            {/* Botão de Enviar*/}
            <Button 
              variant="white" 
              type="submit" 
              className="w-100 fw-semibold py-2 bg-white text-black border-0 rounded-2 hover-opacity d-flex align-items-center justify-content-center"
              style={{ fontSize: "14px" }}
              disabled={loading}
            >
              {loading ? (
                <Spinner animation="border" size="sm" variant="dark" />
              ) : (
                "Cadastrar"
              )}
            </Button>
          </Form>

          {/* Link para o Login */}
          <div className="text-center mt-4">
            <span className="text-muted small">Já possui login? </span>
            <Link to="/login" className="text-white text-decoration-underline small fw-medium ms-1">
              Fazer Login
            </Link>
          </div>

        </Col>
      </Row>
    </Container>
  );
};