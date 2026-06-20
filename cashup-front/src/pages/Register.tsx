import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { TrendingUp, User, Mail, Lock } from "lucide-react";
import { request } from "../services/httpClient";

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
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center bg-success text-white rounded-circle p-3 mb-2">
              <TrendingUp size={32} />
            </div>
            <h2 className="fw-bold text-white">Criar Conta</h2>
            <p className="text-muted">Comece a controlar seu patrimônio</p>
          </div>

          <Card className="bg-dark text-white border-secondary shadow">
            <Card.Body className="p-4">
              <h4 className="mb-4 text-center">Novo Usuário</h4>

              {error && <Alert variant="danger" className="py-2 text-center">{error}</Alert>}
              {success && (
                <Alert variant="success" className="py-2 text-center">
                  Conta criada com sucesso! <a href="#login" className="alert-link">Faça login agora.</a>
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Nome Completo */}
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label className="text-muted d-flex align-items-center gap-2">
                    <User size={16} /> Nome Completo
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Seu nome"
                    className="bg-secondary text-white border-0"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>

                {/* E-mail */}
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label className="text-muted d-flex align-items-center gap-2">
                    <Mail size={16} /> E-mail
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="seu@email.com"
                    className="bg-secondary text-white border-0"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                {/* Senha */}
                <Form.Group className="mb-4" controlId="formPassword">
                  <Form.Label className="text-muted d-flex align-items-center gap-2">
                    <Lock size={16} /> Senha
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    className="bg-secondary text-white border-0"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button 
                  variant="success" 
                  type="submit" 
                  className="w-100 fw-bold py-2"
                  disabled={loading}
                >
                  {loading ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <div className="text-center mt-3">
            <span className="text-muted">Já tem uma conta? </span>
            <a href="#login" className="text-success text-decoration-none fw-bold">Fazer Login</a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};