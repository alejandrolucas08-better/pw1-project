import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { TrendingUp, Mail, Lock } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export const Login: React.FC = () => {
  const { signIn } = useAuth();
  
  // Estados para controlar o formulário e mensagens de erro
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
        await signIn({ email, password });
    } catch (err) {
        const error = err as Error;
        setError(error.message || "Erro ao realizar o login.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          {/* Logo / Nome do App */}
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center bg-success text-white rounded-circle p-3 mb-2">
              <TrendingUp size={32} />
            </div>
            <h2 className="fw-bold text-white">AppInvest</h2>
            <p className="text-muted">Gerencie sua carteira de investimentos</p>
          </div>

          {/* Card do Formulário */}
          <Card className="bg-dark text-white border-secondary shadow">
            <Card.Body className="p-4">
              <h4 className="mb-4 text-center">Acessar Conta</h4>

              {error && <Alert variant="danger" className="py-2 text-center">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                {/* Campo de E-mail */}
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

                {/* Campo de Senha */}
                <Form.Group className="mb-4" controlId="formPassword">
                  <Form.Label className="text-muted d-flex align-items-center gap-2">
                    <Lock size={16} /> Senha
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Sua senha"
                    className="bg-secondary text-white border-0"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                {/* Botão de Enviar */}
                <Button 
                  variant="success" 
                  type="submit" 
                  className="w-100 fw-bold py-2"
                  disabled={loading}
                >
                  {loading ? "Carregando..." : "Entrar"}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {/* Link para o Cadastro */}
          <div className="text-center mt-3">
            <span className="text-muted">Não tem uma conta? </span>
            <a href="#register" className="text-success text-decoration-none fw-bold">Cadastre-se</a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};