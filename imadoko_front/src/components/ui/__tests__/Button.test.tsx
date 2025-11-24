import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
  describe('基本表示', () => {
    it('子要素が表示される', () => {
      render(<Button>クリック</Button>);
      expect(screen.getByRole('button', { name: 'クリック' })).toBeInTheDocument();
    });

    it('デフォルトでprimaryバリアントが適用される', () => {
      render(<Button>ボタン</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-mikasa-blue-deep');
    });
  });

  describe('バリアント', () => {
    it('secondaryバリアントが適用される', () => {
      render(<Button variant="secondary">ボタン</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-white');
    });

    it('dangerバリアントが適用される', () => {
      render(<Button variant="danger">ボタン</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-red-600');
    });

    it('ghostバリアントが適用される', () => {
      render(<Button variant="ghost">ボタン</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-transparent');
    });
  });

  describe('サイズ', () => {
    it('smサイズが適用される', () => {
      render(<Button size="sm">小</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-8', 'px-3', 'text-xs');
    });

    it('mdサイズがデフォルト', () => {
      render(<Button>中</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10', 'px-4', 'text-sm');
    });

    it('lgサイズが適用される', () => {
      render(<Button size="lg">大</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-12', 'px-6', 'text-base');
    });
  });

  describe('disabled状態', () => {
    it('disabled属性が設定される', () => {
      render(<Button disabled>無効</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('disabled時はクリックできない', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(
        <Button disabled onClick={handleClick}>
          無効
        </Button>
      );
      const button = screen.getByRole('button');

      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('イベントハンドラ', () => {
    it('クリック時にonClickが呼ばれる', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(<Button onClick={handleClick}>クリック</Button>);
      const button = screen.getByRole('button');

      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('カスタムクラス', () => {
    it('追加のclassNameが適用される', () => {
      render(<Button className="custom-class">ボタン</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('HTML属性', () => {
    it('type属性が設定される', () => {
      render(<Button type="submit">送信</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('aria-label属性が設定される', () => {
      render(<Button aria-label="閉じる">×</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', '閉じる');
    });
  });
});
