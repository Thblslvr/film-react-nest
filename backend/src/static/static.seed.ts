import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import * as path from 'node:path';

@Injectable()
export class StaticSeedService implements OnApplicationBootstrap {
  // 1x1 JPEG (black pixel)
  private static readonly jpegBase64 =
    '/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAALCAAaABoBAREA/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAdEAACAgIDAQAAAAAAAAAAAAABAgADBAURBhIh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAXEQADAQAAAAAAAAAAAAAAAAAAAREC/9oADAMBAAIRAxEAPwCkY8mKqZ1d0b7bY1x9tOQzqH3n5oLqX7Wq0q5VZpDq2Gg9zq1tUq6vSg1y8yJr8l3lQeQ1VtN7p7Yq8xq8sYJwD6f/2Q==';

  onApplicationBootstrap(): void {
    const publicDir = path.join(process.cwd(), 'public');
    mkdirSync(publicDir, { recursive: true });

    const buffer = Buffer.from(StaticSeedService.jpegBase64, 'base64');
    for (const file of ['bg1s.jpg', 'bg1c.jpg']) {
      const filePath = path.join(publicDir, file);
      if (!existsSync(filePath)) writeFileSync(filePath, buffer);
    }
  }
}
