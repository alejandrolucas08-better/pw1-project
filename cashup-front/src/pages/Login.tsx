import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { TrendingUp, Mail, Lock } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

export const Login: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      await signIn({ email, password });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError((err as Error).message || "Erro ao realizar o login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container 
      className="d-flex align-items-center justify-content-center" 
      style={{ minHeight: "100vh", backgroundColor: "#121212" }}
      fluid
    >
      <Row className="w-100 justify-content-center">
        <Col xs={11} sm={8} md={5} lg={4} xl={3}>
          
          {/* Cabeçalho */}
          <div className="text-center mb-5">
            <div className="text-white mb-2 d-flex align-items-center justify-content-center gap-2">
              <TrendingUp size={24} strokeWidth={2.5} />
              <h3 className="fw-bold m-0 tracking-tight" style={{ letterSpacing: "-0.5px" }}>CashUP</h3>
            </div>
            
            <p className="text-white-50 small">Entre com suas credenciais para acessar o painel</p>
          </div>

          {/* Alerta de erro */}
          {error && (
            <Alert variant="dark" className="py-2 text-center border-danger text-danger bg-transparent small mb-4">
              {error}
            </Alert>
          )}

          {/* Formulário */}
          <Form onSubmit={handleSubmit}>
            
            {/* Campo de E-mail */}
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label className="text-white-50 small d-flex align-items-center gap-2 mb-1">
                <Mail size={14} /> E-mail
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="nome@exemplo.com"
                value={email}
                onChange={handleEmailChange}
                required
                disabled={loading}
                className="text-white border-secondary border-opacity-25 py-2 px-3 shadow-none custom-input"
                style={{ fontSize: "14px", backgroundColor: "#1A1A1A" }} 
              />
            </Form.Group>

            {/* Campo de Senha */}
            <Form.Group className="mb-4" controlId="formPassword">
              <Form.Label className="text-white-50 small d-flex align-items-center gap-2 mb-1">
                <Lock size={14} /> Senha
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                required
                disabled={loading}
                className="text-white border-secondary border-opacity-25 py-2 px-3 shadow-none custom-input"
                style={{ fontSize: "14px", backgroundColor: "#1A1A1A" }} 
              />
            </Form.Group>

            {/* Botão de Submit */}
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
                "Entrar"
              )}
            </Button>
          </Form>

          {/* Link para Cadastro */}
          <div className="text-center mt-4">
            <span className="text-white-50 small">Não possui login? </span>
            <Link to="/register" className="text-white text-decoration-underline small fw-medium ms-1">
              Criar conta
            </Link>
          </div>

        </Col>
      </Row>
    </Container>
  );
};