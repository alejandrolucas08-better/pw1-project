export interface UserAsset {
  id: number;
  user_id: number;     // Chave estrangeira que aponta para o id do usuário
  ticker: string;      // Ex: 'PETR4', 'VALE3'
  quantity: number;    // Quantidade de ações
  created_at: Date;
}