package br.com.meveum.auth.entity.enums;

import java.util.Arrays;

public enum OAuthProvider {
    GOOGLE("google", "Google"),
    MICROSOFT("microsoft", "Microsoft"),
    APPLE("apple", "Apple");

    private final String slug;
    private final String label;

    OAuthProvider(String slug, String label) {
        this.slug = slug;
        this.label = label;
    }

    public String getSlug() {
        return slug;
    }

    public String getLabel() {
        return label;
    }

    public static OAuthProvider fromSlug(String slug) {
        return Arrays.stream(values())
            .filter(provider -> provider.slug.equalsIgnoreCase(slug))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Provedor OAuth invalido."));
    }
}
