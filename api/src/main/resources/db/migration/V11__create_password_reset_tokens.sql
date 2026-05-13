CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY,
    store_user_id UUID NOT NULL REFERENCES store_users(id),
    token VARCHAR(128) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_store_user_id ON password_reset_tokens(store_user_id);
